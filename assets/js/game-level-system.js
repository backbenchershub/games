/**
 * Universal Level System for Backbenchers Games
 * Provides level progression, achievements, and player stats
 */

class GameLevelSystem {
  constructor(gameName) {
    this.gameName = gameName;
    this.playerData = this.loadPlayerData();
    this.achievements = this.initializeAchievements();
    this.levelThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000, 25000, 35000, 50000, 75000];
    this.init();
  }

  init() {
    this.createLevelUI();
    this.updateLevelDisplay();
  }

  loadPlayerData() {
    const saved = localStorage.getItem(`backbenchers_${this.gameName}_data`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      level: 1,
      xp: 0,
      totalScore: 0,
      gamesPlayed: 0,
      bestScore: 0,
      achievements: [],
      stats: {
        totalPlayTime: 0,
        perfectGames: 0,
        streakRecord: 0,
        currentStreak: 0
      }
    };
  }

  savePlayerData() {
    localStorage.setItem(`backbenchers_${this.gameName}_data`, JSON.stringify(this.playerData));
  }

  initializeAchievements() {
    return {
      'first_game': { name: 'First Steps', description: 'Play your first game', xp: 50, unlocked: false },
      'score_100': { name: 'Century', description: 'Score 100 points', xp: 25, unlocked: false },
      'score_500': { name: 'High Roller', description: 'Score 500 points', xp: 50, unlocked: false },
      'score_1000': { name: 'Thousand Club', description: 'Score 1000 points', xp: 100, unlocked: false },
      'games_10': { name: 'Dedicated', description: 'Play 10 games', xp: 75, unlocked: false },
      'games_50': { name: 'Enthusiast', description: 'Play 50 games', xp: 150, unlocked: false },
      'games_100': { name: 'Veteran', description: 'Play 100 games', xp: 300, unlocked: false },
      'level_5': { name: 'Rising Star', description: 'Reach level 5', xp: 200, unlocked: false },
      'level_10': { name: 'Expert', description: 'Reach level 10', xp: 500, unlocked: false },
      'streak_5': { name: 'On Fire', description: 'Win 5 games in a row', xp: 150, unlocked: false },
      'perfect_game': { name: 'Perfectionist', description: 'Complete a perfect game', xp: 200, unlocked: false }
    };
  }

  createLevelUI() {
    // Create level display container
    const levelContainer = document.createElement('div');
    levelContainer.id = 'level-system-ui';
    levelContainer.className = 'level-system-container';
    levelContainer.innerHTML = `
      <div class="level-display">
        <div class="level-info">
          <span class="level-badge">LVL <span id="current-level">${this.playerData.level}</span></span>
          <div class="xp-bar-container">
            <div class="xp-bar">
              <div class="xp-fill" id="xp-fill"></div>
            </div>
            <span class="xp-text" id="xp-text">0/100 XP</span>
          </div>
        </div>
        <button class="stats-btn" id="stats-toggle">📊</button>
      </div>
      
      <div class="stats-panel" id="stats-panel" style="display: none;">
        <h3>Player Stats</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Games Played:</span>
            <span class="stat-value" id="games-played">${this.playerData.gamesPlayed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Best Score:</span>
            <span class="stat-value" id="best-score">${this.playerData.bestScore}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Score:</span>
            <span class="stat-value" id="total-score">${this.playerData.totalScore}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Current Streak:</span>
            <span class="stat-value" id="current-streak">${this.playerData.stats.currentStreak}</span>
          </div>
        </div>
        
        <div class="achievements-section">
          <h4>Recent Achievements</h4>
          <div class="achievements-list" id="achievements-list"></div>
        </div>
      </div>
    `;

    // Add CSS styles
    const styles = document.createElement('style');
    styles.textContent = `
      .level-system-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        background: rgba(30, 30, 40, 0.95);
        border: 2px solid #ffcc00;
        border-radius: 12px;
        padding: 15px;
        min-width: 250px;
        backdrop-filter: blur(10px);
        font-family: 'VT323', monospace;
      }

      .level-display {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .level-badge {
        background: linear-gradient(45deg, #ffcc00, #ffdd57);
        color: #000;
        padding: 5px 10px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 1.1rem;
        text-shadow: none;
      }

      .xp-bar-container {
        flex: 1;
      }

      .xp-bar {
        width: 100%;
        height: 8px;
        background: #333;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 2px;
      }

      .xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff88, #00cc66);
        transition: width 0.5s ease;
        border-radius: 4px;
      }

      .xp-text {
        font-size: 0.9rem;
        color: #ccc;
      }

      .stats-btn {
        background: #ffcc00;
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s;
      }

      .stats-btn:hover {
        background: #ffdd57;
        transform: scale(1.1);
      }

      .stats-panel {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #444;
      }

      .stats-panel h3, .stats-panel h4 {
        color: #ffcc00;
        margin: 0 0 10px 0;
        font-size: 1.2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 15px;
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #aaa;
      }

      .stat-value {
        font-size: 1.1rem;
        color: #fff;
        font-weight: bold;
      }

      .achievements-list {
        max-height: 150px;
        overflow-y: auto;
      }

      .achievement-item {
        background: rgba(255, 204, 0, 0.1);
        border: 1px solid #ffcc00;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 5px;
        animation: achievementPop 0.5s ease;
      }

      .achievement-item.new {
        background: rgba(0, 255, 136, 0.2);
        border-color: #00ff88;
      }

      .achievement-name {
        color: #ffcc00;
        font-weight: bold;
        font-size: 1rem;
      }

      .achievement-desc {
        color: #ccc;
        font-size: 0.9rem;
      }

      .achievement-xp {
        color: #00ff88;
        font-size: 0.8rem;
        float: right;
      }

      @keyframes achievementPop {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      .level-up-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ffcc00, #ffdd57);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        animation: levelUpPop 2s ease;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 204, 0, 0.5);
      }

      @keyframes levelUpPop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
      }

      @media (max-width: 768px) {
        .level-system-container {
          position: relative;
          top: 0;
          right: 0;
          margin: 10px;
          width: calc(100% - 20px);
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(levelContainer);

    // Add event listeners
    document.getElementById('stats-toggle').addEventListener('click', () => {
      const panel = document.getElementById('stats-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    this.updateAchievementsList();
  }

  updateLevelDisplay() {
    const currentLevelElement = document.getElementById('current-level');
    const xpFillElement = document.getElementById('xp-fill');
    const xpTextElement = document.getElementById('xp-text');

    if (currentLevelElement) currentLevelElement.textContent = this.playerData.level;

    const currentLevelXP = this.levelThresholds[this.playerData.level - 1] || 0;
    const nextLevelXP = this.levelThresholds[this.playerData.level] || this.levelThresholds[this.levelThresholds.length - 1];
    const xpInCurrentLevel = this.playerData.xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const xpPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    if (xpFillElement) xpFillElement.style.width = `${Math.min(xpPercentage, 100)}%`;
    if (xpTextElement) xpTextElement.textContent = `${xpInCurrentLevel}/${xpNeededForNextLevel} XP`;

    // Update stats
    const elements = {
      'games-played': this.playerData.gamesPlayed,
      'best-score': this.playerData.bestScore,
      'total-score': this.playerData.totalScore,
      'current-streak': this.playerData.stats.currentStreak
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  addXP(amount, reason = '') {
    this.playerData.xp += amount;
    const oldLevel = this.playerData.level;
    
    // Check for level up
    while (this.playerData.level < this.levelThresholds.length && 
           this.playerData.xp >= this.levelThresholds[this.playerData.level]) {
      this.playerData.level++;
    }

    if (this.playerData.level > oldLevel) {
      this.showLevelUpNotification(this.playerData.level);
      this.checkAchievements();
    }

    this.updateLevelDisplay();
    this.savePlayerData();
  }

  recordGameResult(score, won = false, perfect = false) {
    this.playerData.gamesPlayed++;
    this.playerData.totalScore += score;
    
    if (score > this.playerData.bestScore) {
      this.playerData.bestScore = score;
    }

    if (won) {
      this.playerData.stats.currentStreak++;
      if (this.playerData.stats.currentStreak > this.playerData.stats.streakRecord) {
        this.playerData.stats.streakRecord = this.playerData.stats.currentStreak;
      }
    } else {
      this.playerData.stats.currentStreak = 0;
    }

    if (perfect) {
      this.playerData.stats.perfectGames++;
    }

    // Calculate XP based on performance
    let xpGained = Math.floor(score / 10); // Base XP from score
    if (won) xpGained += 50; // Bonus for winning
    if (perfect) xpGained += 100; // Bonus for perfect game
    if (this.playerData.stats.currentStreak >= 3) xpGained += 25; // Streak bonus

    this.addXP(xpGained, 'Game completed');
    this.checkAchievements();
    this.savePlayerData();
  }

  checkAchievements() {
    const newAchievements = [];

    // Check each achievement
    Object.entries(this.achievements).forEach(([key, achievement]) => {
      if (!this.playerData.achievements.includes(key)) {
        let unlocked = false;

        switch (key) {
          case 'first_game':
            unlocked = this.playerData.gamesPlayed >= 1;
            break;
          case 'score_100':
            unlocked = this.playerData.bestScore >= 100;
            break;
          case 'score_500':
            unlocked = this.playerData.bestScore >= 500;
            break;
          case 'score_1000':
            unlocked = this.playerData.bestScore >= 1000;
            break;
          case 'games_10':
            unlocked = this.playerData.gamesPlayed >= 10;
            break;
          case 'games_50':
            unlocked = this.playerData.gamesPlayed >= 50;
            break;
          case 'games_100':
            unlocked = this.playerData.gamesPlayed >= 100;
            break;
          case 'level_5':
            unlocked = this.playerData.level >= 5;
            break;
          case 'level_10':
            unlocked = this.playerData.level >= 10;
            break;
          case 'streak_5':
            unlocked = this.playerData.stats.streakRecord >= 5;
            break;
          case 'perfect_game':
            unlocked = this.playerData.stats.perfectGames >= 1;
            break;
        }

        if (unlocked) {
          this.playerData.achievements.push(key);
          newAchievements.push({ key, ...achievement });
          this.addXP(achievement.xp, `Achievement: ${achievement.name}`);
        }
      }
    });

    if (newAchievements.length > 0) {
      this.showAchievementNotifications(newAchievements);
      this.updateAchievementsList();
    }
  }

  updateAchievementsList() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;

    const recentAchievements = this.playerData.achievements.slice(-3).reverse();
    
    if (recentAchievements.length === 0) {
      achievementsList.innerHTML = '<div style="color: #666; font-style: italic;">No achievements yet</div>';
      return;
    }

    achievementsList.innerHTML = recentAchievements.map(key => {
      const achievement = this.achievements[key];
      return `
        <div class="achievement-item">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
          <div class="achievement-xp">+${achievement.xp} XP</div>
        </div>
      `;
    }).join('');
  }

  showLevelUpNotification(newLevel) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      🎉 LEVEL UP! 🎉<br>
      <div style="font-size: 2rem; margin: 10px 0;">Level ${newLevel}</div>
      <div style="font-size: 1rem;">Keep playing to unlock more rewards!</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  }

  showAchievementNotifications(achievements) {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
          position: fixed;
          top: ${120 + index * 80}px;
          right: 20px;
          background: linear-gradient(45deg, #00ff88, #00cc66);
          color: #000;
          padding: 15px 20px;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          z-index: 10000;
          animation: slideInRight 0.5s ease;
          max-width: 300px;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
        `;
        
        notification.innerHTML = `
          🏆 Achievement Unlocked!<br>
          <div style="font-size: 1.2rem; margin: 5px 0;">${achievement.name}</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">${achievement.description}</div>
          <div style="font-size: 0.9rem; margin-top: 5px;">+${achievement.xp} XP</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 500);
          }
        }, 3000);
      }, index * 200);
    });

    // Add CSS for animations
    if (!document.getElementById('achievement-animations')) {
      const style = document.createElement('style');
      style.id = 'achievement-animations';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Public methods for games to use
  gameStarted() {
    // Called when a game starts
  }

  gameEnded(score, won = false, perfect = false) {
    this.recordGameResult(score, won, perfect);
  }

  getPlayerLevel() {
    return this.playerData.level;
  }

  getPlayerXP() {
    return this.playerData.xp;
  }

  getPlayerStats() {
    return { ...this.playerData };
  }
}

// Export for use in games
window.GameLevelSystem = GameLevelSystem;
