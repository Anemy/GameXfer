// This is a cache for user leaderboards.
import sync from 'synchronize';

import db from '../Database';
import Constants from '../../shared/Constants';

class LeaderboardCache {
  constructor() {
    this.topCoin = [];
    this.topPosters = [];

    setInterval(() => {
      this.updateCache();
    }, Constants.LEADERBOARD_UPDATE_FREQUENCY_MS);

    // Get the initial leaderboard data.
    this.updateCache();
  }

  getTopUsersFromDatabase(sortObject) {
    const topUsers = sync.await(db.collection('users').find({
      deleted: {
        $exists: false
      }
    }, {
      username: 1,
      displayUsername: 1,
      posts: 1,
      xferCoin: 1
    }).sort(sortObject).limit(Constants.USERS_IN_LEADERBOARD).toArray(sync.defer()));

    return topUsers;
  }

  updateTopCoin() {
    this.topCoin = this.getTopUsersFromDatabase({
      xferCoin: -1
    });
  }

  updatePosters() {
    // Find the users with the most posts.
    this.topPosters = this.getTopUsersFromDatabase({
      posts: -1
    });
  }

  updateCache() {
    sync.fiber(() => {
      // TODO: This could be run in parallel.
      this.updateTopCoin();
      this.updatePosters();
    });
  }

  getTopCoin() {
    return this.topCoin;
  }

  getTopPosters() {
    return this.topPosters;
  }

  getLeaderboards() {
    return {
      topCoin: this.topCoin,
      topPosters: this.topPosters
    };
  }
}

export default new LeaderboardCache();