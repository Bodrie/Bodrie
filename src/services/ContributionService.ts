import type {
  UserContributions,
  ContributionDay,
  StreakInfo,
  GraphQLContributionsResponse,
} from '../types.js';
import { GitHubClient } from '../core/GitHubClient.js';
import { DATE_RANGES } from '../constants/constants.js';

/**
 * Handles contribution graph parsing and streak calculations
 */
export class ContributionService {
  #githubClient: GitHubClient;

  constructor(githubClient: GitHubClient) {
    this.#githubClient = githubClient;
  }

  /**
   * Fetch user contributions via GraphQL
   * GitHub's API limits queries to 1 year, so we split into yearly chunks and merge.
   */
  async fetchUserContributions(): Promise<UserContributions> {
    console.log('  Fetching contributions (including private)...');

    const today = new Date();
    const rangeStart = new Date(today);
    rangeStart.setDate(today.getDate() - DATE_RANGES.CONTRIBUTION_DAYS);

    // Build yearly chunks (GitHub API max span is 1 year)
    const chunks: { from: Date; to: Date }[] = [];
    let chunkStart = new Date(rangeStart);
    while (chunkStart < today) {
      const chunkEnd = new Date(chunkStart);
      chunkEnd.setFullYear(chunkEnd.getFullYear() + 1);
      chunks.push({
        from: new Date(chunkStart),
        to: chunkEnd > today ? new Date(today) : chunkEnd,
      });
      chunkStart = new Date(chunkEnd);
    }

    console.log(
      `  📅 Querying contributions from ${rangeStart.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]} (${chunks.length} request(s))`,
    );

    const results = await Promise.all(
      chunks.map(chunk => this.#fetchContributionChunk(chunk.from, chunk.to)),
    );

    // Merge all chunks into one UserContributions
    const merged = results.reduce((acc, curr) =>
      this.#mergeContributions(acc, curr),
    );

    console.log(
      `  📊 Contribution breakdown (${rangeStart.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}):`,
    );
    console.log(`     - Commits: ${merged.totalCommitContributions}`);
    console.log(`     - PRs: ${merged.totalPullRequestContributions}`);
    console.log(
      `     - Reviews: ${merged.totalPullRequestReviewContributions}`,
    );
    console.log(`     - Issues: ${merged.totalIssueContributions}`);
    console.log(`     - Repos: ${merged.totalRepositoryContributions}`);
    console.log(`     - Restricted: ${merged.restrictedContributionsCount}`);
    console.log(
      `     - Calendar Total: ${merged.contributionCalendar.totalContributions}`,
    );

    return merged;
  }

  /**
   * Fetch a single chunk of contributions (max 1 year span)
   */
  async #fetchContributionChunk(
    from: Date,
    to: Date,
  ): Promise<UserContributions> {
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoryContributions
            totalRepositoriesWithContributedCommits
            restrictedContributionsCount
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const result = (await this.#githubClient.graphql(query, {
      username: this.#githubClient.user,
      from: from.toISOString(),
      to: to.toISOString(),
    })) as GraphQLContributionsResponse;

    return result.user.contributionsCollection;
  }

  /**
   * Merge two UserContributions objects (sum totals, concatenate calendar days)
   */
  #mergeContributions(
    a: UserContributions,
    b: UserContributions,
  ): UserContributions {
    // Deduplicate calendar days by date (later chunk wins on overlap)
    const dayMap = new Map<
      string,
      { date: string; contributionCount: number; contributionLevel: string }
    >();
    for (const week of a.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap.set(day.date, day);
      }
    }
    for (const week of b.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap.set(day.date, day);
      }
    }

    const allDays = Array.from(dayMap.values()).sort(
      (x, y) => new Date(x.date).getTime() - new Date(y.date).getTime(),
    );

    // Group days into weeks (7 days each)
    const weeks: {
      contributionDays: typeof allDays;
    }[] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push({ contributionDays: allDays.slice(i, i + 7) });
    }

    return {
      totalCommitContributions:
        a.totalCommitContributions + b.totalCommitContributions,
      totalIssueContributions:
        a.totalIssueContributions + b.totalIssueContributions,
      totalPullRequestContributions:
        a.totalPullRequestContributions + b.totalPullRequestContributions,
      totalPullRequestReviewContributions:
        a.totalPullRequestReviewContributions +
        b.totalPullRequestReviewContributions,
      totalRepositoryContributions:
        a.totalRepositoryContributions + b.totalRepositoryContributions,
      totalRepositoriesWithContributedCommits:
        a.totalRepositoriesWithContributedCommits +
        b.totalRepositoriesWithContributedCommits,
      restrictedContributionsCount:
        a.restrictedContributionsCount + b.restrictedContributionsCount,
      contributionCalendar: {
        totalContributions:
          a.contributionCalendar.totalContributions +
          b.contributionCalendar.totalContributions,
        weeks,
      },
    };
  }

  /**
   * Parse contribution graph from UserContributions
   */
  parseContributionGraph(contributions: UserContributions): ContributionDay[] {
    const days: ContributionDay[] = [];

    for (const week of contributions.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        days.push({
          date: day.date,
          count: day.contributionCount,
          level: this.#getContributionLevel(day.contributionCount),
        });
      }
    }

    return days;
  }

  /**
   * Get contribution level from count
   */
  #getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  }

  /**
   * Calculate streak information
   */
  calculateStreak(contributions: ContributionDay[]): StreakInfo {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort by date descending
    const sortedContributions = [...contributions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Calculate current streak
    let streakActive = true;
    for (const day of sortedContributions) {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (streakActive && day.count > 0) {
        currentStreak++;
      } else if (streakActive && day.count === 0) {
        const diffDays = Math.floor(
          (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays > 1) {
          streakActive = false;
        }
      }
    }

    // Calculate longest streak
    for (const day of contributions) {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const totalContributions = contributions.reduce(
      (sum, day) => sum + day.count,
      0,
    );

    return {
      currentStreak,
      longestStreak,
      totalContributions,
    };
  }
}
