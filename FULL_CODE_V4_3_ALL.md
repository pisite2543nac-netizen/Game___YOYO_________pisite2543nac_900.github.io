# FULL CODE V4.3 — Code Typing Academy
> ไฟล์นี้รวม Code runtime ทั้งหมดของ Release V4.3

---

## index.html

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
  <title>ระบบเกมพิมพ์ Code | วิทยาลัยเทคนิคนางรอง</title>
  <link rel="stylesheet" href="./style.css?v=4.3.0">
</head>
<body>
<header class="site-header">
  <div class="wrap header-inner">
    <div>
      <div class="kicker">NANGRONG TECHNICAL COLLEGE</div>
      <h1>ระบบเกมพิมพ์ Code</h1>
      <p>วิทยาลัยเทคนิคนางรอง</p>
    </div>
    <a class="admin-link" href="admin.html">Admin</a>
  </div>
</header>

<main class="wrap">
  <section id="authScreen" class="card account-card">
    <div class="creator-banner">ผู้จัดทำ: นายพิสิษฐ์ หุนตระนี ครูพิเศษสอน</div>

    <div class="auth-tabs">
      <button id="loginTab" class="auth-tab active" type="button">เข้าสู่ระบบ</button>
      <button id="registerTab" class="auth-tab" type="button">ลงทะเบียนผู้ใช้ใหม่</button>
    </div>

    <section id="loginPanel" class="auth-panel">
      <span class="section-kicker">STUDENT LOGIN</span>
      <h2>เข้าสู่ระบบผู้เล่น</h2>
      <p class="muted-line">ใช้เลขประจำตัวนักศึกษาและรหัสผ่านที่สร้างไว้ตอนลงทะเบียน</p>

      <form id="loginForm" class="form-grid">
        <label>
          <span>เลขประจำตัวนักศึกษา</span>
          <input id="loginStudentId" inputmode="numeric" pattern="[0-9]+" required placeholder="กรอกเฉพาะตัวเลข">
        </label>
        <label>
          <span>รหัสผ่าน</span>
          <div class="password-row">
            <input id="loginPassword" type="password" required placeholder="กรอกรหัสผ่าน">
            <button class="show-password" type="button" data-toggle-password="loginPassword">แสดง</button>
          </div>
        </label>
        <div class="full form-footer">
          <span id="loginMessage"></span>
          <button class="btn primary" type="submit">เข้าสู่ระบบ</button>
        </div>
      </form>
    </section>

    <section id="registerPanel" class="auth-panel hidden">
      <span class="section-kicker">NEW STUDENT ACCOUNT</span>
      <h2>ลงทะเบียนผู้เล่น</h2>
      <p class="muted-line">ลงทะเบียนครั้งแรกเพียงครั้งเดียว จากนั้นใช้เลขนักศึกษาและรหัสผ่าน Login ได้</p>

      <form id="registerForm" class="form-grid">
        <label>
          <span>เลขประจำตัวนักศึกษา</span>
          <input id="studentId" inputmode="numeric" pattern="[0-9]+" required placeholder="กรอกเฉพาะตัวเลข">
        </label>

        <label>
          <span>ชื่อ-นามสกุล</span>
          <input id="fullName" required placeholder="ชื่อ มิงกาลาบา เมียงปร่ะ">
        </label>

        <label>
          <span>ระดับชั้น</span>
          <select id="educationLevel" required>
            <option value="">-- เลือกระดับชั้น --</option>
            <option>ปวช.1</option>
            <option>ปวช.2</option>
            <option>ปวช.3</option>
            <option>ปวส.1</option>
            <option>ปวส.2</option>
          </select>
        </label>

        <label>
          <span>ห้อง / กลุ่ม</span>
          <select id="classroom" required>
            <option value="">-- เลือกห้อง --</option>
            <option>/1</option><option>/2</option><option>/3</option>
            <option>/4</option><option>/5</option><option>/6</option>
          </select>
        </label>

        <label>
          <span>แผนกวิชา</span>
          <input id="department" required placeholder="เช่น เทคโนโลยีสารสนเทศ">
        </label>

        <label>
          <span>สร้างรหัสผ่าน</span>
          <div class="password-row">
            <input id="password" type="password" minlength="6" required placeholder="อย่างน้อย 6 ตัวอักษร">
            <button class="show-password" type="button" data-toggle-password="password">แสดง</button>
          </div>
        </label>

        <label>
          <span>ยืนยันรหัสผ่าน</span>
          <div class="password-row">
            <input id="confirmPassword" type="password" minlength="6" required placeholder="กรอกรหัสผ่านอีกครั้ง">
            <button class="show-password" type="button" data-toggle-password="confirmPassword">แสดง</button>
          </div>
        </label>

        <label class="full consent">
          <input id="acceptRules" type="checkbox">
          <span>ข้าพเจ้ายืนยันว่าข้อมูลถูกต้อง และยอมรับคำชี้แจงการใช้งานระบบ</span>
        </label>

        <div class="full form-footer">
          <span id="registerMessage">เมื่อลงทะเบียนสำเร็จ ชื่อจะปรากฏในหน้า Admin แบบเรียลไทม์</span>
          <button id="registerButton" class="btn primary" type="submit" disabled>ลงทะเบียนและสร้างบัญชี</button>
        </div>
      </form>
    </section>
  </section>

  <section id="userPortal" class="hidden">
    <div class="user-portal-head card">
      <div>
        <span class="section-kicker">CODE LEARNING HUB</span>
        <h2>เลือกภาษาและโหมดการเรียนรู้</h2>
        <p id="portalWelcome">-</p>
      </div>
      <div class="portal-head-actions">
        <button id="openCharacterProfileButton" class="btn character-profile-entry" type="button">🧍 ดูตัวละคร</button>
        <a href="zone.html" class="btn zone-entry-main">🌙 2D Zone</a>
        <button id="logoutUserButton" class="btn ghost">ออกจากระบบ</button>
      </div>
    </div>

    <div class="portal-stat-grid">
      <div class="card portal-stat"><span>เล่นทั้งหมด</span><strong id="userTotalAttempts">0</strong></div>
      <div class="card portal-stat"><span>เล่นสำเร็จ</span><strong id="userCompleted">0</strong></div>
      <div class="card portal-stat"><span>คะแนนสูงสุด</span><strong id="userBestScore">0</strong></div>
      <div class="card portal-stat"><span>WPM สูงสุด</span><strong id="userBestWpm">0</strong></div>
      <div class="card portal-stat points-stat"><span>Token สะสม</span><strong id="userTokens">0</strong><small>TOKENS</small></div>
      <div class="card portal-stat rank-stat"><span>Rank Season</span><strong id="userRank">-</strong><small id="rankSeasonLabel">60 DAYS</small></div>
    </div>

    <section id="mobileZoneOnlyNotice" class="card hidden mobile-zone-only-card">
      <div class="mobile-zone-only-badge">📱 MOBILE / TABLET MODE</div>
      <h3>มือถือและแท็บเล็ตเข้าใช้งานเฉพาะ 2D Zone</h3>
      <p>มือถือและแท็บเล็ตจะเข้าสู่ 2D Zone หลัง Login โดยอัตโนมัติ เพื่อให้ใช้งานได้ง่ายและเสถียร ส่วนคอมพิวเตอร์ยังใช้ระบบเรียน พิมพ์โค้ด PVP โหมดทางการ Ranking และ Admin ได้ครบ</p>
      <div class="mobile-zone-only-actions">
        <a id="mobileZoneOnlyEnter" href="zone.html" class="btn primary">🌙 เข้า 2D Zone</a>
      </div>
      <small>บน 2D Zone: Admin แสดงชื่อเหนือหัวเป็น GM และผู้เล่นทั่วไปแสดงเป็นรหัสนักศึกษา</small>
    </section>

    <section id="languageSection" class="card">
      <div class="section-title">
        <div>
          <span class="section-kicker">STEP 1 · LANGUAGE</span>
          <h2>เลือกภาษาเขียนโปรแกรม</h2>
          <p class="muted-line">แต่ละภาษามีบทเรียน คำอธิบาย ตัวอย่าง Preview และผลลัพธ์แยกจากกัน</p>
        </div>
      </div>
      <div id="languageCards" class="language-grid"></div>
    </section>

    <section id="learningSection" class="card hidden">
      <div class="section-title">
        <div>
          <span class="section-kicker">LEARN BEFORE PLAY</span>
          <h2 id="learningTitle">บทเรียน</h2>
          <p id="learningTagline" class="muted-line"></p>
        </div>
      </div>

      <div id="lessonTabs" class="lesson-tabs"></div>
      <div id="stageSelector" class="stage-selector"></div>
      <div id="lessonDetail"></div>
    </section>

    <section id="modeSection" class="card hidden">
      <div class="section-title">
        <div>
          <span class="section-kicker">STEP 2 · GAME MODE</span>
          <h2>เลือกโหมดเกม</h2>
        </div>
      </div>
      <div class="mode-card-grid two-col">
        <button class="mode-choice selected" data-game-mode="classic">
          <span class="mode-choice-icon">⌨️</span>
          <strong>Classic Solo</strong>
          <small>เล่นคนเดียว จับเวลา วัด WPM / Accuracy / Mistakes และคะแนน</small>
          <div><span>Solo</span><span>Timer</span><span>3 Difficulties</span></div>
        </button>
        <button class="mode-choice official-mode" data-game-mode="official">
          <span class="mode-choice-icon">📋</span>
          <strong>ทางการ</strong>
          <small>30 ด่านสำหรับงานครู คะแนนรวมเต็ม 40 คะแนน ต้องกดส่งงานเมื่อทำเสร็จ</small>
          <div><span>30 Stages</span><span>40 Scores</span><span>Teacher</span></div>
        </button>
        <button class="mode-choice" data-game-mode="pvp">
          <span class="mode-choice-icon">⚔️</span>
          <strong>PVP Realtime</strong>
          <small>สร้างหรือเข้าห้อง แข่งพิมพ์ Code เดียวกัน 2 คน และดู Progress แบบเรียลไทม์</small>
          <div><span>2 Players</span><span>Firebase</span><span>Realtime</span></div>
        </button>
      </div>
    </section>

    <section id="classicConfig" class="card hidden">
      <div class="section-title">
        <div>
          <span class="section-kicker">CLASSIC SOLO</span>
          <h2>เลือกระดับความยาก</h2>
          <p class="muted-line">ระบบจะเลือกโจทย์ของภาษาที่เลือกตามระดับ และเริ่มจับเวลาเมื่อเริ่มพิมพ์</p>
        </div>
      </div>
      <div id="difficultyCards" class="difficulty-grid"></div>
      <div class="stage-panel">
        <h3>เลือกด่าน</h3>
        <div id="classicStageGrid" class="classic-stage-grid"></div>
      </div>
      <div class="config-footer">
        <div id="classicLessonSummary" class="selected-summary">ยังไม่ได้เลือกภาษา/ระดับ</div>
        <button id="startClassicButton" class="btn primary" disabled>เริ่ม Classic</button>
      </div>
    </section>


    <section id="officialConfig" class="card hidden">
      <div class="section-title">
        <div>
          <span class="section-kicker">OFFICIAL · TEACHER ASSIGNMENT</span>
          <h2>โหมดทางการ 30 ด่าน</h2>
          <p class="muted-line">คะแนนเต็มรวม 40 คะแนน คะแนนจะไม่แสดงในหน้า User และจะถูกส่งไปหน้า Admin เมื่อกด “ส่งงานทางการ” เท่านั้น</p>
        </div>
      </div>

      <div class="official-summary-grid">
        <div><span>จำนวนด่าน</span><strong>30</strong></div>
        <div><span>คะแนนเต็ม</span><strong>40</strong></div>
        <div><span>ทำแล้ว</span><strong id="officialCompletedCount">0</strong></div>
        <div><span>สถานะ</span><strong id="officialSubmitStatus">ยังไม่ส่ง</strong></div>
      </div>

      <div id="officialStageGrid" class="official-stage-grid"></div>

      <div class="official-actions">
        <button id="submitOfficialButton" class="btn primary" disabled>ส่งงานทางการให้ครู</button>
        <small>ปุ่มจะเปิดเมื่อทำครบ 30 ด่าน และใช้ส่งคะแนนเข้าระบบ Admin</small>
      </div>
    </section>

    <section id="pvpConfig" class="card hidden">
      <div class="section-title">
        <div>
          <span class="section-kicker">PVP MATCHMAKING · REALTIME</span>
          <h2>จับคู่ PVP ให้เร็วขึ้น</h2>
          <p class="muted-line">
            มีเพียง 2 ทางเลือก: สร้างห้องใหม่ หรือให้ระบบค้นหาห้องว่างให้อัตโนมัติ
            Room Code ทุกห้องสุ่มโดยระบบเท่านั้น ผู้เล่นไม่สามารถตั้ง Code เองได้
          </p>
        </div>
      </div>

      <div class="pvp-match-actions">
        <button id="createRoomButton" class="pvp-match-card create" type="button">
          <span class="pvp-match-icon">➕</span>
          <strong>สร้างห้อง</strong>
          <small>ระบบสุ่ม Room Code ใหม่ที่ไม่ซ้ำ แล้วเปิด Lobby รอผู้เล่นอีก 1 คน</small>
          <em>AUTO ROOM CODE</em>
        </button>

        <button id="findRoomButton" class="pvp-match-card find" type="button">
          <span class="pvp-match-icon">🔎</span>
          <strong>ค้นหาห้อง</strong>
          <small>ระบบค้นหา Lobby ที่กำลังรออยู่ แล้วสุ่มเข้าห้องที่ว่างให้อัตโนมัติ</small>
          <em>RANDOM MATCH</em>
        </button>
      </div>

      <div id="matchmakingStatus" class="matchmaking-status">
        <span class="matchmaking-dot"></span>
        <strong id="matchmakingStatusText">พร้อมจับคู่</strong>
        <small id="matchmakingStatusDetail">เลือก “สร้างห้อง” หรือ “ค้นหาห้อง”</small>
      </div>

      <div id="pvpLobby" class="pvp-lobby pvp-lobby-v2 hidden">
        <div class="room-code-card">
          <span>ROOM CODE · ระบบสร้างอัตโนมัติ</span>
          <strong id="roomCodeLabel">------</strong>
          <small>Code นี้เป็นแบบอ่านอย่างเดียว ผู้เล่นไม่สามารถแก้ไขได้</small>
        </div>

        <div class="pvp-player-slot">
          <span>ผู้เล่น 1</span>
          <strong id="pvpPlayer1">รอผู้เล่น...</strong>
          <small>HOST</small>
        </div>

        <div class="pvp-player-slot">
          <span>ผู้เล่น 2</span>
          <strong id="pvpPlayer2">รอผู้เล่น...</strong>
          <small>CHALLENGER</small>
        </div>

        <div class="pvp-status-slot">
          <span>สถานะ</span>
          <strong id="pvpStatus">WAITING</strong>
          <small id="pvpLobbyHint">กำลังรอผู้เล่น...</small>
        </div>
      </div>

      <div class="pvp-lobby-actions">
        <button id="startPvpButton" class="btn primary hidden" type="button">เริ่มการแข่งขัน</button>
        <button id="leaveLobbyButton" class="btn ghost hidden" type="button">ออกจากห้อง</button>
      </div>
    </section>


    <section class="social-hub-grid">
      <article class="card community-card">
        <div class="section-title compact">
          <div>
            <span class="section-kicker">PLAYER COMMUNITY</span>
            <h2>ผู้เล่นในระบบ</h2>
            <p class="muted-line">ดูผู้เล่นคนอื่น พร้อมสถานะ Online และ Rank ปัจจุบัน</p>
          </div>
          <div class="online-count-pill"><span class="online-dot"></span><strong id="onlinePlayerCount">0</strong> ONLINE</div>
        </div>
        <div id="communityPlayersList" class="community-players-list">
          <div class="empty-card">กำลังโหลดรายชื่อผู้เล่น...</div>
        </div>
      </article>

      <article class="card leaderboard-card">
        <div class="section-title compact">
          <div>
            <span class="section-kicker">SEASON LEADERBOARD</span>
            <h2>อันดับ Ranking 1–10</h2>
            <p class="muted-line">อันดับของ Season 60 วันปัจจุบัน</p>
          </div>
          <div id="leaderboardSeason" class="season-chip">SEASON</div>
        </div>
        <div id="topRankingList" class="top-ranking-list">
          <div class="empty-card">กำลังโหลดอันดับ...</div>
        </div>
        <div class="rank-shield-legend" aria-label="ระดับแรงค์">
          <div><span class="rank-shield rank-bronze small"><span class="rank-shield-letter">B</span></span><b>Bronze</b></div>
          <div><span class="rank-shield rank-silver small"><span class="rank-shield-letter">S</span></span><b>Silver</b></div>
          <div><span class="rank-shield rank-gold small"><span class="rank-shield-letter">G</span></span><b>Gold</b></div>
          <div><span class="rank-shield rank-platinum small"><span class="rank-shield-letter">P</span></span><b>Platinum</b></div>
          <div><span class="rank-shield rank-diamond small"><span class="rank-shield-letter">D</span></span><b>Diamond</b></div>
          <div><span class="rank-shield rank-master small"><span class="rank-shield-letter">M</span></span><b>Master</b></div>
        </div>
      </article>
    </section>

    <section class="card zone-entry-card">
      <div class="zone-entry-copy">
        <span class="section-kicker">2D SOCIAL ZONE</span>
        <h2>พบปะผู้เล่นใน 2D Zone</h2>
        <p>เดินด้วย WASD หรือปุ่มลูกศร พบตัวละคร User คนอื่นแบบ Realtime และเห็นชื่อกับโล่ Rank เหนือตัวละคร</p>
        <div class="zone-feature-pills">
          <span>Realtime Players</span><span>Rank Shield</span><span>WASD</span><span>Character Profile</span>
        </div>
      </div>
      <div class="zone-entry-actions">
        <div class="zone-preview-mini"><span class="mini-avatar a">A</span><span class="mini-avatar b">B</span><span class="mini-avatar c">C</span></div>
        <a href="zone.html" class="btn primary zone-enter-btn">เข้า 2D Zone →</a>
      </div>
    </section>

    <section class="card character-placeholder">
      <div>
        <span class="section-kicker">CHARACTER & 2D ZONE · READY FOR NEXT PHASE</span>
        <h2>ระบบตัวละครของ User เตรียมโครงสร้างไว้แล้ว</h2>
        <p>บัญชีแต่ละ User มีข้อมูล avatar, outfit, inventory และตำแหน่ง Zone รองรับการสร้างพื้นที่ 2D ที่ผู้เล่นพบกันและโชว์ตัวละครแบบ Realtime ในรอบถัดไป</p>
      </div>
      <div class="character-silhouette">🧍</div>
    </section>

    <section class="card">
      <div class="section-title">
        <div><span class="section-kicker">YOUR HISTORY</span><h2>ประวัติการเล่นล่าสุด</h2></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>วันเวลา</th><th>ภาษา</th><th>โหมด</th><th>ระดับ</th><th>สถานะ</th><th>คะแนน</th><th>WPM</th><th>Accuracy</th></tr></thead>
          <tbody id="userHistoryBody"></tbody>
        </table>
      </div>
    </section>
  </section>

  <section id="pvpGameScreen" class="card hidden">
    <div class="game-head">
      <div><span class="badge">⚔️ PVP</span><h2 id="pvpChallengeTitle">PVP Challenge</h2><p id="pvpChallengeDescription"></p></div>
      <div class="player-box"><strong id="pvpRoomGame">Room ------</strong><span id="pvpOpponentName">คู่แข่ง: -</span></div>
    </div>

    <div class="pvp-progress-board">
      <div><span id="myPvpName">YOU</span><div class="pvp-track"><div id="myPvpBar"></div></div><strong id="myPvpPct">0%</strong></div>
      <div><span id="oppPvpName">OPPONENT</span><div class="pvp-track"><div id="oppPvpBar"></div></div><strong id="oppPvpPct">0%</strong></div>
    </div>

    <div class="game-stats">
      <div><span>เวลา</span><strong id="pvpTime">00:00</strong></div>
      <div><span>WPM</span><strong id="pvpWpm">0</strong></div>
      <div><span>Accuracy</span><strong id="pvpAccuracy">100%</strong></div>
      <div><span>Mistakes</span><strong id="pvpMistakes">0</strong></div>
      <div><span>Progress</span><strong id="pvpProgress">0%</strong></div>
      <div><span>Status</span><strong id="pvpGameStatus">READY</strong></div>
    </div>

    <div id="pvpTypingStage" class="typing-stage" tabindex="0">
      <div class="editor-bar"><div class="editor-dots"><i></i><i></i><i></i></div><span>PVP CHALLENGE</span><span>Realtime</span></div>
      <pre id="pvpTypingDisplay" class="typing-display"></pre>
      <textarea id="pvpTypingInput" class="hidden-input" spellcheck="false"></textarea>
    </div>
    <div class="game-bottom"><button id="leavePvpButton" class="btn danger">ออกจาก PVP</button><span id="pvpSaveState">กำลังเชื่อม...</span></div>
  </section>

  <section id="gameScreen" class="game-fullscreen hidden">
    <div id="gameShell" class="game-shell">
      <div id="mobileGameTools" class="mobile-game-tools" aria-label="เครื่องมือเกมบนมือถือ">
        <button id="mobileFocusButton" type="button" class="mobile-tool-btn">⌨️ พิมพ์ต่อ</button>
        <button id="mobileStatsButton" type="button" class="mobile-tool-btn">📊 สถิติ</button>
        <button id="mobileExitButton" type="button" class="mobile-tool-btn danger-lite">✕ ออก</button>
      </div>

      <div id="mobileStatsSheet" class="mobile-stats-sheet hidden" role="dialog" aria-modal="true" aria-label="สถิติการเล่น">
        <div class="mobile-sheet-card">
          <div class="mobile-sheet-head">
            <strong>สถิติการเล่น</strong>
            <button id="closeMobileStats" type="button" aria-label="ปิด">✕</button>
          </div>
          <div class="mobile-stats-grid">
            <div><span>ด่าน</span><strong id="mobileStatLevel">01</strong></div>
            <div><span>เวลา</span><strong id="mobileStatTime">00:00</strong></div>
            <div><span>WPM</span><strong id="mobileStatWpm">0</strong></div>
            <div><span>Accuracy</span><strong id="mobileStatAccuracy">100%</strong></div>
            <div><span>Mistakes</span><strong id="mobileStatMistakes">0</strong></div>
            <div><span>Token</span><strong id="mobileStatToken">0</strong></div>
          </div>
        </div>
      </div>
      <div class="fullscreen-topbar">
        <div class="game-identity">
          <span id="modeBadge" class="badge">⌨️ CLASSIC</span>
          <div>
            <strong id="challengeTitle">Level</strong>
            <small id="challengeDescription"></small>
          </div>
        </div>

        <div class="game-top-actions"><span id="deviceHint" class="device-hint" aria-live="polite"></span>
          <span id="playerName">-</span>
          <button id="fullscreenButton" class="btn ghost small-btn" type="button">⛶ เต็มหน้าจอ</button>
          <button id="quitButton" class="btn danger small-btn" type="button">ออก</button>
        </div>
      </div>

      <div class="game-stats fullscreen-stats">
        <div><span>ด่าน</span><strong id="statLevel">01</strong></div>
        <div><span>เวลา</span><strong id="statTime">00:00</strong></div>
        <div><span>WPM</span><strong id="statWpm">0</strong></div>
        <div><span>Accuracy</span><strong id="statAccuracy">100%</strong></div>
        <div><span>Mistakes</span><strong id="statMistakes">0</strong></div>
        <div><span>Token ด่าน</span><strong id="statScore">0</strong></div>
      </div>

      <div class="game-main-area">
        <div class="code-side">
          <div class="code-info fullscreen-tags">
            <span id="languageLabel">HTML</span>
            <span id="difficultyLabel">ง่าย</span>
            <span id="timeRuleLabel">จับเวลา</span>
            <span id="saveState">พร้อมเล่น</span>
          </div>

          <div id="typingStage" class="typing-stage strict-stage" tabindex="0" role="application" aria-label="พื้นที่พิมพ์โค้ด">
            <div class="editor-bar">
              <div class="editor-dots"><i></i><i></i><i></i></div>
              <span id="fileName">challenge_01</span>
              <span id="typingStatus">พิมพ์ตัวแรกเพื่อเริ่ม</span>
            </div>
            <pre id="typingDisplay" class="typing-display fullscreen-code"></pre>
            <textarea id="typingInput" class="hidden-input" spellcheck="false" autocomplete="off"></textarea>
          </div>

          <div class="progress-line compact-progress">
            <div class="progress-track"><div id="progressBar"></div></div>
            <span id="progressText">0 / 0</span>
          </div>
        </div>

        <aside class="game-help-side">
          <div class="strict-guide">
            <h3>STRICT TYPING</h3>
            <p><b>สีเขียว</b> = พิมพ์ถูก</p>
            <p><b>พิมพ์ผิด</b> = จอสั่นและตำแหน่งจะไม่เดินต่อ</p>
            <p>ไม่ต้อง Backspace — พิมพ์ตัวเดิมใหม่ให้ถูกแล้วไปต่อได้ทันที</p>
          </div>
          <div class="keyboard-area compact-keyboard">
            <p>คีย์บอร์ดจำลอง</p>
            <div id="keyboard" class="keyboard"></div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section id="resultScreen" class="card hidden result-screen">
    <span class="section-kicker">RESULT</span>
    <h2 id="resultTitle">บันทึกผลเรียบร้อยแล้ว</h2>
    <p id="resultText"></p>
    <div class="result-grid">
      <div><span>Score</span><strong id="resultScore">0</strong></div>
      <div><span>WPM</span><strong id="resultWpm">0</strong></div>
      <div><span>Accuracy</span><strong id="resultAccuracy">0%</strong></div>
      <div><span>Time</span><strong id="resultTime">0s</strong></div>
    </div>
    <div class="result-actions">
      <button id="playAgainButton" class="btn secondary">เล่น Level เดิมอีกครั้ง</button>
      <button id="nextLevelButton" class="btn primary">Level ถัดไป</button>
      <button id="portalButton" class="btn ghost">กลับหน้าเลือกโหมด</button>
    </div>
  </section>
</main>

<footer><div class="wrap">ระบบเกมพิมพ์ Code · วิทยาลัยเทคนิคนางรอง</div></footer>
<script type="module" src="./app.js?v=4.3.0"></script>

  <div id="characterSetupModal" class="character-modal hidden">
    <div class="character-modal-card character-setup-card">
      <span class="section-kicker">CHARACTER SETUP</span>
      <h2>เลือกตัวละครของคุณ</h2>
      <p>หลังลงทะเบียนต้องเลือกตัวละครชายหรือหญิงก่อนใช้งาน จากนั้นใช้ Token แลกไอเท็มมาแต่งตัวได้</p>

      <div class="character-gender-grid">
        <button id="selectMaleCharacter" class="character-gender-option" type="button">
          <div class="character-stage preview-stage">
            <div class="game-character male">
              <div class="char-hair"></div><div class="char-head"></div>
              <div class="char-body"></div><div class="char-arm left"></div><div class="char-arm right"></div>
              <div class="char-shorts"></div><div class="char-leg left"></div><div class="char-leg right"></div>
              <div class="char-shoe left"></div><div class="char-shoe right"></div>
            </div>
          </div>
          <strong>ชาย</strong><small>ตัวละครพื้นฐาน</small>
        </button>

        <button id="selectFemaleCharacter" class="character-gender-option" type="button">
          <div class="character-stage preview-stage">
            <div class="game-character female">
              <div class="char-hair"></div><div class="char-head"></div>
              <div class="char-body"></div><div class="char-arm left"></div><div class="char-arm right"></div>
              <div class="char-shorts"></div><div class="char-leg left"></div><div class="char-leg right"></div>
              <div class="char-shoe left"></div><div class="char-shoe right"></div>
            </div>
          </div>
          <strong>หญิง</strong><small>ตัวละครพื้นฐาน</small>
        </button>
      </div>
    </div>
  </div>

  <div id="characterProfileModal" class="character-modal hidden">
    <div class="character-modal-card profile-character-card">
      <button id="closeCharacterProfileButton" class="character-modal-close" type="button">✕</button>

      <div class="character-profile-layout">
        <section class="character-display-panel">
          <span class="section-kicker">MY CHARACTER</span>
          <h2 id="characterProfileStudentId">-</h2>

          <div class="character-stage large-stage">
            <div id="profileCharacter" class="game-character male">
              <div class="char-aura"></div>
              <div class="char-back-item"></div>
              <div class="char-hair"></div><div class="char-head"></div>
              <div class="char-face-item"></div>
              <div class="char-body"></div><div class="char-top-item"></div>
              <div class="char-arm left"></div><div class="char-arm right"></div>
              <div class="char-hand-item"></div>
              <div class="char-shorts"></div><div class="char-bottom-item"></div>
              <div class="char-leg left"></div><div class="char-leg right"></div>
              <div class="char-shoe left"></div><div class="char-shoe right"></div>
              <div class="char-head-item"></div>
              <div class="char-pet-item"></div>
            </div>
          </div>

          <div class="character-profile-stats">
            <div><span>Token</span><strong id="characterTokenBalance">0</strong></div>
            <div><span>Rank</span><strong id="characterRankName">Bronze</strong></div>
            <div><span>ไอเท็ม</span><strong id="characterOwnedCount">0</strong></div>
          </div>

          <div class="character-profile-actions">
            <a href="zone.html" class="btn zone-entry-main">🛒 ไป Token Shop ใน 2D Zone</a>
            <button id="unequipAllButton" class="btn ghost" type="button">ถอดไอเท็มทั้งหมด</button>
          </div>
        </section>

        <section class="character-inventory-panel">
          <div class="character-inventory-head">
            <div>
              <span class="section-kicker">WARDROBE</span>
              <h3>ไอเท็มที่เป็นเจ้าของ</h3>
            </div>
            <small>ไอเท็มแพงขึ้นจะยิ่งมีเอฟเฟกต์อลังการ</small>
          </div>
          <div id="characterInventoryList" class="character-inventory-list"></div>
        </section>
      </div>
    </div>
  </div>

</body>
</html>
```

---

## admin.html

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Admin | ระบบเกมพิมพ์ Code</title>
  <link rel="stylesheet" href="./style.css?v=4.3.0">
</head>
<body class="admin-page">
  <main class="wrap admin-wrap">
    <section id="adminLogin" class="card admin-login">
      <div class="kicker">ADMINISTRATOR</div>
      <h1>ผู้ดูแลระบบเกมพิมพ์ Code</h1>
      <p>วิทยาลัยเทคนิคนางรอง</p>

      <form id="adminLoginForm" class="stack-form">
        <label>
          <span>Username</span>
          <input id="adminUsername" type="text" required autocomplete="username">
        </label>
        <label>
          <span>Password</span>
          <input id="adminPassword" type="password" required>
        </label>
        <div class="login-actions">
          <a href="index.html">← กลับหน้าผู้เล่น</a>
          <button class="btn primary" type="submit">เข้าสู่ระบบ</button>
        </div>
        <p id="adminLoginError" class="error-text"></p>
      </form>
    </section>

    <section id="adminDashboard" class="hidden">
      <div class="admin-titlebar">
        <div>
          <div class="kicker">NANGRONG TECHNICAL COLLEGE</div>
          <h1>แผงควบคุมเกมพิมพ์ Code <span class="realtime-badge">● REALTIME</span></h1>
          <p>ผู้จัดทำ: นายพิสิษฐ์ หุนตระนี ครูพิเศษสอน</p>
        </div>
        <div>
          <a class="btn gm-zone-entry" href="./zone.html?v=4.3.0">🌙 เข้า 2D Zone · GM</a>
          <a class="btn ghost" href="index.html">หน้าผู้เล่น</a>
          <button id="logoutAdmin" class="btn secondary">ออกจากระบบ</button>
        </div>
      </div>

      <div class="admin-metrics">
        <div><span>โจทย์ในคลัง</span><strong id="metricLevels">0</strong></div>
        <div><span>ลงทะเบียน</span><strong id="metricUsers">0</strong></div>
        <div><span>เล่นสำเร็จ</span><strong id="metricCompleted">0</strong></div>
        <div><span>คะแนนเฉลี่ย</span><strong id="metricAverage">0</strong></div>
      </div>

      <div class="admin-tabs">
        <button class="tab active" data-tab="resultsTab">ผลการเล่น</button>
        <button class="tab" data-tab="usersTab">สมาชิก User</button>
        <button class="tab" data-tab="levelsTab">จัดการโจทย์ Code</button>
        <button class="tab" data-tab="officialTab">คะแนนทางการ</button>
        <button class="tab" data-tab="rankingTab">Ranking</button>
        <button class="tab zone-admin-tab" data-tab="zoneControlTab">🌙 ควบคุม 2D Zone</button>
        <button class="tab zone-chat-admin-tab" data-tab="zoneChatLogTab">💬 ประวัติแชต Zone</button>
        <button class="tab" data-tab="backupTab">สำรองข้อมูล</button>
      </div>

      <section id="resultsTab" class="admin-tab-panel">
        <div class="panel-title">
          <div>
            <h2>ผลการเล่น</h2>
            <p>คะแนน WPM Accuracy Mistakes เวลา และโหมดของผู้เล่น</p>
          </div>
          <div class="button-row">
            <button id="exportCsv" class="btn secondary">ดาวน์โหลด CSV</button>
            <button id="deleteResults" class="btn danger">ลบผลทั้งหมด</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>วันเวลา</th><th>เลขนักศึกษา</th><th>ชื่อ</th><th>ชั้น</th>
                <th>แผนก</th><th>โหมด</th><th>Level</th><th>สถานะ</th>
                <th>Score</th><th>WPM</th><th>Accuracy</th><th>จัดการ</th>
              </tr>
            </thead>
            <tbody id="resultsBody"></tbody>
          </table>
        </div>
      </section>

      <section id="usersTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>ข้อมูลสมาชิก User</h2>
            <p>สมาชิกที่ลงทะเบียนบัญชีเข้าสู่ระบบเกม</p>
          </div>
          <button id="deleteUsers" class="btn danger">ลบข้อมูลทั้งหมด</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>วันเวลา</th><th>เลขนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>ชั้น/ห้อง</th><th>แผนกวิชา</th><th>แต้ม</th><th>สถานะ</th><th>จัดการ</th></tr>
            </thead>
            <tbody id="usersBody"></tbody>
          </table>
        </div>
      </section>

      <section id="levelsTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>จัดการคลังโจทย์ Code</h2>
            <p>ระบบรองรับการเพิ่ม แก้ไข และลบโจทย์ Code ราย Level โดยกำหนดภาษา ระดับความยาก คะแนนฐาน เวลา และตัวคูณความยากได้ หากต้องการกลับค่าเริ่มต้นให้ใช้ปุ่มคืนค่า 12 Level เริ่มต้น</p>
          </div>
          <button id="seedDefaults" class="btn secondary">คืนค่า 12 Level เริ่มต้น</button>
        </div>

        <form id="levelForm" class="form-grid admin-level-form">
          <label><span>Level</span><input id="editLevelNo" type="number" min="1" required></label>
          <label><span>ชื่อโจทย์</span><input id="editTitle" required></label>
          <label><span>ภาษา</span><input id="editLanguage" placeholder="HTML / CSS / JavaScript / Python" required></label>
          <label><span>ระดับ</span>
            <select id="editDifficulty">
              <option>ง่าย</option><option>ปานกลาง</option><option>ยาก</option><option>Expert</option>
            </select>
          </label>
          <label><span>คะแนนฐาน</span><input id="editBasePoints" type="number" min="1" value="100" required></label>
          <label><span>เวลาเป้าหมาย (วินาที)</span><input id="editTimeLimit" type="number" min="10" value="90" required></label>
          <label><span>ตัวคูณความยาก</span><input id="editMultiplier" type="number" step="0.05" min="1" value="1" required></label>
          <label><span>คำอธิบาย</span><input id="editDescription"></label>
          <label class="full"><span>Code</span><textarea id="editCode" rows="12" required></textarea></label>
          <button class="btn primary full" type="submit">บันทึกโจทย์</button>
        </form>

        <div id="levelCards" class="level-admin-cards"></div>
      </section>


      <section id="officialTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>คะแนนงานทางการ</h2>
            <p>แสดงเฉพาะงานที่ User กด “ส่งงานทางการ” แล้ว คะแนนเต็ม 40 คะแนน</p>
          </div>
          <button id="exportOfficialCsv" class="btn secondary">ดาวน์โหลดคะแนน CSV</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>วันส่ง</th><th>เลขนักศึกษา</th><th>ชื่อ</th><th>ชั้น/ห้อง</th>
                <th>แผนก</th><th>ทำครบ</th><th>คะแนน /40</th><th>Accuracy</th><th>WPM</th>
              </tr>
            </thead>
            <tbody id="officialBody"></tbody>
          </table>
        </div>
      </section>

      <section id="rankingTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>Ranking Season 60 วัน</h2>
            <p>คำนวณจากความขยัน 35% · Accuracy 30% · Speed 20% · Consistency 15%</p>
          </div>
          <button id="recalculateRanking" class="btn secondary">คำนวณ Rank ใหม่</button>
        </div>
        <div class="ranking-season-banner">
          <span>Season</span><strong id="adminSeasonId">-</strong>
          <span id="adminSeasonRange">-</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>ผู้เล่น</th><th>Rank</th><th>Rating</th><th>ขยัน</th>
                <th>แม่นยำ</th><th>ความเร็ว</th><th>สม่ำเสมอ</th><th>WPM เฉลี่ย</th>
              </tr>
            </thead>
            <tbody id="rankingBody"></tbody>
          </table>
        </div>
      </section>


      <section id="zoneControlTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>ควบคุม 2D Zone</h2>
            <p>ดูผู้เล่นใน Zone แบบ Realtime · เตะออก · แบนตามระยะเวลา · ปลดแบน</p>
          </div>
          <div class="zone-admin-summary">
            <span><b id="zoneOnlineMetric">0</b> ONLINE</span>
            <span><b id="zoneBannedMetric">0</b> BANNED</span>
          </div>
        </div>

        <div class="zone-admin-help">
          <strong>เตะ:</strong> ออกจาก Zone ชั่วคราว และสามารถกลับเข้าใหม่ได้หลังช่วงเตะหมด
          <strong>แบน:</strong> ไม่สามารถอ่าน/เขียนข้อมูล 2D Zone ได้จนกว่าจะครบเวลาหรือ GM ปลดแบน
        </div>

        <div class="table-wrap">
          <table class="zone-control-table">
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ</th>
                <th>Rank</th>
                <th>สถานะ Zone</th>
                <th>ล่าสุด</th>
                <th>แบนถึง</th>
                <th>เหตุผล</th>
                <th>ระยะเวลา</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody id="zoneControlBody"></tbody>
          </table>
        </div>
      </section>


      <section id="zoneChatLogTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>ประวัติแชต 2D Zone</h2>
            <p>User เก็บ/แสดง 24 ชั่วโมง · GM เป็นข้อความถาวรจนกว่าจะลบ · ใช้ตรวจสอบการสนทนาในกลุ่ม</p>
          </div>
          <div class="button-row">
            <button id="exportZoneChatCsv" class="btn secondary">ดาวน์โหลด Chat CSV</button>
            <button id="cleanupExpiredZoneChat" class="btn warning">ล้าง User Chat ที่หมดอายุ</button>
          </div>
        </div>
        <div class="admin-zone-chat-summary">
          <span><b id="zoneChat24hMetric">0</b> USER 24H</span>
          <span><b id="zoneChatGmMetric">0</b> GM PERMANENT</span>
          <span><b id="zoneChatTotalMetric">0</b> ADMIN ARCHIVE</span>
        </div>
        <div id="zoneChatAdminList" class="admin-zone-chat-list"></div>
      </section>

      <section id="backupTab" class="admin-tab-panel hidden">
        <div class="panel-title">
          <div>
            <h2>สำรอง / ย้ายข้อมูล</h2>
            <p>ส่งออกข้อมูล Firestore เป็น JSON สำหรับสำรอง หรือ Import กลับเข้าสู่ระบบ</p>
          </div>
        </div>
        <div class="backup-actions">
          <button id="exportJson" class="btn primary">ดาวน์โหลดข้อมูล JSON</button>
          <label class="file-label">
            นำเข้า JSON
            <input id="importJson" type="file" accept=".json,application/json">
          </label>
        </div>
      </section>
    </section>
  </main>

  <div id="adminToast" class="admin-toast hidden" aria-live="polite"></div>
  <script type="module" src="./admin.js?v=4.3.0"></script>
</body>
</html>

```

---

## zone.html

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b2b40">
  <title>2D Zone · Code Typing Academy</title>
  <link rel="stylesheet" href="./style.css?v=4.3.0">
</head>
<body class="zone-v41-page">
  <div id="zoneGate" class="zone-v40-gate">
    <div class="zone-v40-gate-card">
      <div id="zoneGateIcon" class="zone-v40-gate-icon">🌙</div>
      <span class="section-kicker">2D ZONE · V4.3.0</span>
      <h1 id="zoneGateTitle">กำลังเปิด 2D Social Zone</h1>
      <p id="zoneGateText">กำลังตรวจสอบระบบ...</p>

      <div id="zoneBootSteps" class="zone-boot-steps">
        <div data-step="script"><span>1</span><strong>ไฟล์ Zone</strong><em>กำลังโหลด</em></div>
        <div data-step="auth"><span>2</span><strong>บัญชีผู้ใช้</strong><em>รอ</em></div>
        <div data-step="profile"><span>3</span><strong>ตัวละคร</strong><em>รอ</em></div>
        <div data-step="rules"><span>4</span><strong>Firebase Rules</strong><em>รอ</em></div>
        <div data-step="world"><span>5</span><strong>Realtime World</strong><em>รอ</em></div>
      </div>

      <div id="zoneGateErrorHelp" class="zone-gate-error-help hidden"></div>
      <a id="zoneGateBack" href="./index.html" class="btn ghost">กลับ</a>
    </div>
  </div>

  <main id="zoneApp" class="zone-v40-app hidden">
    <header class="zone-v40-topbar">
      <div class="zone-v40-brand">
        <span id="zoneWorldIcon" class="zone-v40-logo">🌙</span>
        <div>
          <strong>THAI VILLAGE · 2D SOCIAL ZONE</strong>
          <small>เดิน · พูดคุย · GM · Token Shop · Chat 24H</small>
        </div>
      </div>

      <div class="zone-v40-time">
        <span id="zoneWorldPeriod">กลางคืน</span>
        <strong id="zoneWorldCountdown">เปลี่ยนใน --:--:--</strong>
      </div>

      <div class="zone-v40-self">
        <div id="zoneMyShield"></div>
        <div>
          <strong id="zoneMyStudentId">-</strong>
          <small><span class="online-dot"></span> ONLINE · <span id="zoneOnlineCount">1</span> คน</small>
        </div>
      </div>

      <div class="zone-v40-wallet">
        <span id="zoneWalletLabel">🪙 TOKEN</span>
        <strong id="zoneTokenBalance">0</strong>
      </div>

      <div class="zone-v40-actions">
        <button id="openZoneChatHistory" class="btn zone-chat-history-button" type="button">💬 แชต 24 ชม.</button>
        <button id="openZoneShop" class="btn zone-shop-button" type="button">🛒 ร้านค้า</button>
        <button id="openMyZoneProfile" class="btn ghost" type="button">🧍 ตัวละคร</button>
        <a id="openAdminPanel" href="./admin.html" class="btn gm-admin-panel hidden">🛡️ Admin</a>
        <a id="leaveZoneButton" href="./index.html" class="btn danger">ออก</a>
      </div>
    </header>

    <section id="zoneWorld" class="zone-v40-world" data-period="night">
      <canvas id="zoneCanvas"></canvas>

      <div class="zone-v40-help">
        <span>เดิน</span><b>◀ / ▶</b>
        <span>หรือ A / D</span>
        <span>คลิก TOKEN SHOP · คลิกตัวละครเพื่อดูโปรไฟล์</span>
      </div>

      <div id="zoneConnectionBadge" class="zone-connection-badge">
        <span class="online-dot"></span><strong>REALTIME</strong>
      </div>

      <div id="zonePlayerCard" class="zone-v40-player-card hidden">
        <button id="closeZonePlayerCard" type="button">✕</button>
        <div id="zonePlayerCardShield"></div>
        <h3 id="zonePlayerCardId">-</h3>
        <p id="zonePlayerCardRank">Bronze</p>
        <span id="zonePlayerCardItemTitle">ไอเท็มที่กำลังสวม</span>
        <div id="zonePlayerCardItems" class="zone-player-equipped-list"></div>
      </div>
    </section>

    <footer class="zone-v40-controls">
      <button id="moveLeftButton" class="zone-move-button" type="button">◀</button>

      <form id="zoneChatForm" class="zone-v40-chat-form">
        <input id="zoneChatInput" maxlength="120" autocomplete="off"
               placeholder="พิมพ์ข้อความที่จะพูดเหนือหัวตัวละคร...">
        <button type="submit">พูด</button>
      </form>

      <button id="moveRightButton" class="zone-move-button" type="button">▶</button>
    </footer>
  </main>

  <div id="zoneChatHistoryModal" class="zone-v40-modal hidden">
    <div class="zone-v40-modal-card zone-chat-history-card">
      <button id="closeZoneChatHistory" class="zone-v40-modal-close" type="button">✕</button>
      <div class="zone-chat-history-head">
        <div>
          <span class="section-kicker">ZONE GROUP CHAT</span>
          <h2>ประวัติแชต 2D Zone</h2>
          <p>ข้อความ User แสดง 24 ชั่วโมง · ข้อความ GM เป็นประกาศถาวรจนกว่า GM จะลบ</p>
        </div>
        <div class="zone-chat-history-legend">
          <span class="user">USER · 24H</span>
          <span class="gm">GM · ถาวร</span>
        </div>
      </div>
      <div id="zoneChatHistoryList" class="zone-chat-history-list"></div>
    </div>
  </div>

  <div id="zoneShopModal" class="zone-v40-modal hidden">
    <div class="zone-v40-modal-card shop-modal-card">
      <button id="closeZoneShop" class="zone-v40-modal-close" type="button">✕</button>
      <div class="zone-shop-head">
        <div>
          <span class="section-kicker">TOKEN SHOP · 2D ZONE</span>
          <h2>ร้านค้าใน Zone</h2>
          <p>ไอเท็ม GM ไม่อยู่ในร้านและ User ไม่สามารถครอบครองได้</p>
        </div>
        <div class="zone-shop-wallet">
          <span>Token ของคุณ</span>
          <strong id="zoneShopBalance">0</strong>
        </div>
      </div>
      <div id="zoneShopGrid" class="zone-shop-grid"></div>
    </div>
  </div>

  <div id="zoneMyProfileModal" class="zone-v40-modal hidden">
    <div class="zone-v40-modal-card zone-own-profile-card">
      <button id="closeMyZoneProfile" class="zone-v40-modal-close" type="button">✕</button>
      <span id="zoneProfileKicker" class="section-kicker">MY CHARACTER</span>
      <h2 id="zoneProfileStudentId">-</h2>
      <div class="zone-profile-preview">
        <canvas id="zoneProfileCanvas" width="420" height="430"></canvas>
      </div>
      <p id="zoneProfileHelp">ซื้อและสวมใส่ไอเท็มได้จาก Token Shop ภายใน Zone</p>
    </div>
  </div>

  <script>
  (function(){
    window.__ZONE_V43_BOOTED__ = false;
    const t=()=>document.getElementById("zoneGateText");
    const h=()=>document.getElementById("zoneGateErrorHelp");
    function fail(message){
      if(t())t().textContent=message;
      if(h()){
        h().classList.remove("hidden");
        h().innerHTML="<strong>ตรวจไฟล์ V4.3.0</strong><p>อัปโหลดไฟล์ทั้งชุดและ Publish firestore.rules เวอร์ชันเดียวกัน</p>";
      }
    }
    window.addEventListener("error",e=>{if(!window.__ZONE_V43_BOOTED__)fail("โหลด 2D Zone ไม่สำเร็จ: "+(e.message||"JavaScript error"));});
    window.addEventListener("unhandledrejection",e=>{if(!window.__ZONE_V43_BOOTED__)fail("เปิด 2D Zone ไม่สำเร็จ: "+(e.reason?.message||e.reason?.code||"Promise error"));});
    setTimeout(()=>{if(!window.__ZONE_V43_BOOTED__)fail("2D Zone ใช้เวลานานผิดปกติ — ตรวจ zone.js และ Firebase Rules");},9000);
  })();
  </script>
  <script type="module" src="./zone.js?v=4.3.0"></script>
</body>
</html>
```

---

## chat.html

```html
<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./zone.html?v=4.3.0"><title>ย้ายไป 2D Zone</title><script>location.replace("./zone.html?v=4.3.0");</script></head><body><p>ระบบแชตรวมย้ายเข้า 2D Zone แล้ว</p><a href="./zone.html?v=4.3.0">เข้า 2D Zone</a></body></html>
```

---

## 404.html

```html
<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>กำลังกู้คืนหน้า</title><style>body{font-family:system-ui;margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fa;color:#173449}.box{max-width:520px;padding:30px;text-align:center;background:#fff;border:1px solid #dce3ea;border-radius:16px}.box a{display:inline-block;margin:6px;padding:10px 16px;border-radius:9px;background:#244b75;color:#fff;text-decoration:none}</style></head><body><div class="box"><h1>กำลังกู้คืนหน้า...</h1><p>กำลังกู้คืน URL ของ GitHub Pages</p><a href="./index.html?v=4.3.0">หน้า Login</a><a href="./zone.html?v=4.3.0">2D Zone</a></div><script>(function(){const ua=navigator.userAgent||"";const mobile=/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);const parts=location.pathname.split("/").filter(Boolean);const base=parts.length?`/${parts[0]}/`:"/";const wanted=base+((location.pathname.toLowerCase().includes("zone")||mobile)?"zone.html?v=4.3.0":"index.html?v=4.3.0");if(!sessionStorage.getItem("v43_404_recovered")){sessionStorage.setItem("v43_404_recovered","1");setTimeout(()=>location.replace(wanted),700)}})();</script></body></html>
```

---

## style.css

```css
:root{
  --blue:#244b75;
  --blue2:#193a5d;
  --blue-soft:#eef4fa;
  --text:#17202b;
  --muted:#677382;
  --line:#dce3ea;
  --card:#fff;
  --bg:#f5f7fa;
  --red:#b83838;
  --green:#237a54;
  --orange:#ad6b17;
  --shadow:0 8px 30px rgba(28,45,65,.08);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:"Segoe UI",Tahoma,Arial,sans-serif}
button,input,select,textarea{font:inherit}
a{text-decoration:none;color:inherit}
.wrap{width:min(1180px,calc(100% - 32px));margin:auto}
.site-header{padding:30px 0 20px;background:#fff;border-bottom:1px solid var(--line)}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:24px}
.site-header h1{margin:5px 0 4px;font-size:32px}
.site-header p{margin:0;color:var(--muted)}
.kicker,.section-kicker{font-size:11px;letter-spacing:.16em;font-weight:800;color:var(--blue)}
.admin-link{padding:10px 18px;border:1px solid var(--line);border-radius:9px;background:#fff;font-weight:700}
main.wrap{padding:24px 0 50px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);padding:30px;margin-bottom:22px}
.hero-card{padding:34px}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:36px;align-items:center}
.badge{display:inline-flex;background:var(--blue-soft);color:var(--blue);font-size:11px;font-weight:800;letter-spacing:.1em;padding:7px 10px;border-radius:999px}
.hero-card h2{font-size:36px;line-height:1.18;margin:12px 0}
.lead{font-size:17px;line-height:1.8;color:var(--muted)}
.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:24px}
.summary-grid div{border:1px solid var(--line);border-radius:10px;padding:14px;text-align:center}
.summary-grid strong,.summary-grid span{display:block}.summary-grid strong{font-size:20px;color:var(--blue)}.summary-grid span{font-size:9px;color:var(--muted);margin-top:5px}
.code-preview{background:#111820;color:#e9f1f8;border-radius:13px;overflow:hidden}
.preview-top{height:40px;background:#18222c;display:flex;gap:6px;align-items:center;padding:0 14px}
.preview-top span{width:8px;height:8px;background:#7d8995;border-radius:50%}
.code-preview pre{margin:0;padding:32px 24px;min-height:220px;font:16px/1.8 Consolas,monospace;white-space:pre-wrap}
.instructions{border-top:1px solid var(--line);margin-top:30px;padding-top:24px}.instructions h3{margin:0 0 12px}.instructions li{margin:8px 0;line-height:1.6;color:#3e4a59}
.section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.section-title h2{margin:5px 0 0}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-grid label span{display:block;font-size:13px;font-weight:700;margin-bottom:7px}
.form-grid input,.form-grid select,.form-grid textarea,.stack-form input{width:100%;border:1px solid #cbd5df;border-radius:8px;padding:11px 12px;background:#fff;outline:none}
.form-grid input:focus,.form-grid select:focus,.form-grid textarea:focus,.stack-form input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(36,75,117,.10)}
.full{grid-column:1/-1}
.consent{display:flex!important;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--line);padding:12px;border-radius:8px}
.consent input{width:auto}.consent span{margin:0!important;font-weight:500!important}
.form-footer{display:flex;justify-content:space-between;align-items:center;gap:16px}.form-footer>span{color:var(--muted);font-size:13px}
.btn{border:0;border-radius:8px;min-height:40px;padding:0 16px;font-weight:700;cursor:pointer}
.btn:disabled{opacity:.45;cursor:not-allowed}.primary{background:var(--blue);color:#fff}.secondary{background:#e7edf4;color:#223f5c}.ghost{background:#fff;border:1px solid var(--line)}.danger{background:#a94141;color:#fff}.btn-small{min-height:32px;font-size:12px}
.game-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.game-head h2{margin:10px 0 5px}.game-head p{margin:0;color:var(--muted)}
.player-box{text-align:right}.player-box strong,.player-box span{display:block}.player-box span{font-size:12px;color:var(--muted);margin-top:5px}
.game-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:24px 0}
.game-stats div{border:1px solid var(--line);border-radius:10px;text-align:center;padding:14px 8px}.game-stats span,.game-stats strong{display:block}.game-stats span{font-size:10px;color:var(--muted);letter-spacing:.04em}.game-stats strong{font-size:22px;margin-top:6px;color:var(--blue)}
.code-info{display:flex;gap:7px;margin-bottom:10px}.code-info span{font-size:11px;border:1px solid var(--line);border-radius:999px;padding:5px 9px;background:#f9fafb}
.typing-stage{position:relative;border:1px solid #cfd8e2;border-radius:10px;overflow:hidden;background:#fff;cursor:text}.typing-stage.active{border-color:#86a9cb}.editor-bar{height:44px;background:#f7f9fb;border-bottom:1px solid var(--line);padding:0 14px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;font-size:11px;color:var(--muted)}.editor-bar>:last-child{text-align:right}.editor-dots{display:flex;gap:5px}.editor-dots i{width:8px;height:8px;border-radius:50%;background:#c4ccd5}
.typing-display{margin:0;min-height:330px;max-height:480px;overflow:auto;padding:30px 36px;font:600 21px/1.75 Consolas,"Courier New",monospace;white-space:pre-wrap}.typing-display .pending{color:#a7afb8}.typing-display .correct{color:#19212a}.typing-display .wrong{color:#b92828;background:#ffe6e6}.typing-display .current{border-left:2px solid var(--blue);animation:blink .9s infinite}@keyframes blink{50%{border-left-color:transparent}}
.hidden-input{position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}
.progress-line{display:flex;gap:12px;align-items:center;margin:12px 0 24px}.progress-track{height:8px;flex:1;background:#e9edf1;border-radius:999px;overflow:hidden}.progress-track div{height:100%;width:0;background:var(--blue);transition:width .12s}.progress-line span{min-width:100px;text-align:right;font-size:12px;color:var(--muted)}
.keyboard-area{width:min(710px,100%);margin:auto}.keyboard-area p{text-align:center;color:var(--muted);font-size:11px}.keyboard{border:1px solid #c6ced6;background:#eef1f4;border-radius:9px;padding:7px;user-select:none}.keyboard-row{display:flex;justify-content:center;gap:4px;margin-bottom:4px}.key{height:32px;min-width:36px;padding:0 6px;display:grid;place-items:center;background:#fff;border:1px solid #bdc6cf;border-radius:5px;box-shadow:0 2px 0 #c7ced5;font-size:9px}.key.wide{min-width:62px}.key.space{width:270px}.key.active{background:#a9cbed;border-color:#568dc2;transform:translateY(2px);box-shadow:none}
.game-bottom{margin-top:24px;border-top:1px solid var(--line);padding-top:18px;display:flex;justify-content:space-between;align-items:center}.game-bottom span{font-size:12px;color:var(--muted)}
.result-screen{text-align:center;padding:50px 30px}.result-screen h2{font-size:34px;margin:8px 0}.result-screen>p{color:var(--muted)}
.result-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:720px;margin:26px auto}.result-grid div{border:1px solid var(--line);border-radius:10px;padding:18px}.result-grid span,.result-grid strong{display:block}.result-grid span{font-size:10px;color:var(--muted)}.result-grid strong{font-size:26px;color:var(--blue);margin-top:6px}.result-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}.red{color:var(--red)}
footer{background:#fff;border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:12px;text-align:center}
.hidden{display:none!important}.shake{animation:shake .2s}@keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.admin-page{background:#f1f4f7}.admin-wrap{padding-top:45px!important}.admin-login{max-width:520px;margin:40px auto}.admin-login h1{margin:7px 0}.admin-login>p{color:var(--muted)}.stack-form{display:grid;gap:15px;margin-top:25px}.stack-form label span{display:block;font-size:13px;font-weight:700;margin-bottom:7px}.login-actions{display:flex;align-items:center;justify-content:space-between}.login-actions a{font-size:13px;color:var(--blue)}.error-text{color:var(--red);font-size:13px}
.admin-titlebar{display:flex;justify-content:space-between;align-items:center;gap:24px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:25px;margin-bottom:18px}.admin-titlebar h1{margin:6px 0}.admin-titlebar p{margin:0;color:var(--muted)}.admin-titlebar>div:last-child{display:flex;gap:8px}
.admin-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.admin-metrics div{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px}.admin-metrics span,.admin-metrics strong{display:block}.admin-metrics span{font-size:12px;color:var(--muted)}.admin-metrics strong{font-size:30px;margin-top:8px;color:var(--blue)}
.admin-tabs{display:flex;gap:7px;margin:20px 0 0}.tab{border:1px solid var(--line);border-bottom:0;background:#e9edf1;padding:11px 17px;border-radius:9px 9px 0 0;cursor:pointer;font-weight:700}.tab.active{background:#fff;color:var(--blue)}
.admin-tab-panel{background:#fff;border:1px solid var(--line);padding:24px;border-radius:0 12px 12px 12px;box-shadow:var(--shadow)}
.panel-title{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:18px}.panel-title h2{margin:0 0 5px}.panel-title p{margin:0;color:var(--muted);font-size:13px}.button-row{display:flex;gap:7px;flex-wrap:wrap}
.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:12px}th,td{text-align:left;border-bottom:1px solid var(--line);padding:10px;white-space:nowrap}th{background:#f7f9fb;color:#536171}.empty{text-align:center;color:var(--muted);padding:30px}.status{display:inline-flex;border-radius:999px;padding:4px 7px;background:#edf1f5;font-size:10px}.status-completed{color:var(--green);background:#e6f6ee}.status-timeout,.status-abandoned{color:var(--red);background:#fceaea}.status-playing{color:var(--orange);background:#fff3dd}.mini-delete{border:0;background:#f8e7e7;color:#963939;padding:5px 8px;border-radius:5px;cursor:pointer}
.admin-level-form{background:#f8fafb;border:1px solid var(--line);border-radius:10px;padding:18px}.level-admin-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:20px}.level-admin-card{border:1px solid var(--line);border-radius:10px;padding:15px;display:flex;justify-content:space-between;align-items:center;gap:15px}.level-admin-card span{font-size:10px;color:var(--blue);font-weight:800}.level-admin-card h3{font-size:15px;margin:4px 0}.level-admin-card p{margin:0;font-size:11px;color:var(--muted)}.backup-actions{display:flex;gap:12px;align-items:center}.file-label{border:1px solid var(--line);background:#fff;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer}.file-label input{display:none}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr}.game-stats{grid-template-columns:repeat(3,1fr)}.summary-grid{grid-template-columns:repeat(2,1fr)}.admin-metrics{grid-template-columns:repeat(2,1fr)}.level-admin-cards{grid-template-columns:1fr}}
@media(max-width:650px){.card{padding:20px}.form-grid{grid-template-columns:1fr}.full{grid-column:1}.form-footer,.game-head,.admin-titlebar,.panel-title{display:block}.form-footer .btn,.admin-titlebar>div:last-child{margin-top:12px}.game-stats{grid-template-columns:repeat(2,1fr)}.typing-display{padding:22px 16px;font-size:15px}.keyboard-area{overflow:auto}.keyboard{min-width:680px}.result-grid{grid-template-columns:repeat(2,1fr)}.admin-tabs{overflow:auto}.admin-tab-panel{border-radius:0 0 12px 12px}}

/* ===== User Portal v2 ===== */
.exam-summary-line{display:flex;gap:10px;flex-wrap:wrap;padding-bottom:18px;margin-bottom:22px;border-bottom:1px solid var(--line)}
.exam-summary-line span,.exam-summary-line strong{padding:7px 10px;background:#f4f7fa;border:1px solid var(--line);border-radius:7px;font-size:12px}
.instruction-list{padding-left:22px;margin-bottom:20px}.instruction-list li{margin:9px 0;line-height:1.65;color:#3f4b58}
.creator-line{font-size:12px;color:var(--muted);margin:20px 0 0}
.user-portal-head{display:flex;justify-content:space-between;align-items:center}.user-portal-head h2{margin:6px 0}.user-portal-head p{margin:0;color:var(--muted)}
.portal-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.portal-stat{margin-bottom:0;padding:20px}.portal-stat span,.portal-stat strong{display:block}.portal-stat span{font-size:12px;color:var(--muted)}.portal-stat strong{font-size:29px;margin-top:7px;color:var(--blue)}
.mode-card-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.mode-choice{border:1px solid var(--line);background:#fff;border-radius:10px;padding:18px;text-align:left;cursor:pointer;min-height:210px;transition:.15s}.mode-choice:hover,.mode-choice.selected{border-color:var(--blue);box-shadow:0 0 0 2px rgba(36,75,117,.10)}.mode-choice-icon{display:block;font-size:28px;margin-bottom:13px}.mode-choice strong,.mode-choice small{display:block}.mode-choice strong{font-size:17px}.mode-choice small{color:var(--muted);line-height:1.5;margin:8px 0 14px;min-height:56px}.mode-choice div{display:flex;gap:5px;flex-wrap:wrap}.mode-choice div span{font-size:10px;background:#f3f6f9;border-radius:999px;padding:5px 7px}
.level-card-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.level-choice{border:1px solid var(--line);background:#fff;border-radius:9px;padding:15px;text-align:left;cursor:pointer}.level-choice:hover{border-color:var(--blue);background:#f8fbfe}.level-choice>span,.level-choice>strong,.level-choice>small,.level-choice>div{display:block}.level-choice>span{font-size:10px;color:var(--blue);font-weight:800}.level-choice>strong{margin:5px 0;font-size:14px}.level-choice>small{color:var(--muted);min-height:31px}.level-choice>div{margin-top:10px;font-size:10px;color:var(--muted)}.level-choice b{font-size:15px;color:var(--blue)}
.empty-card{grid-column:1/-1;padding:30px;text-align:center;color:var(--muted);background:#f8fafb;border:1px dashed var(--line);border-radius:9px}.muted-line{color:var(--muted)}
@media(max-width:950px){.mode-card-grid,.level-card-grid{grid-template-columns:repeat(2,1fr)}.portal-stat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.mode-card-grid,.level-card-grid,.portal-stat-grid{grid-template-columns:1fr}.user-portal-head{display:block}.user-portal-head button{margin-top:12px}}

/* ===== Permanent User Account + Realtime Admin ===== */
.account-card{max-width:1080px;margin-left:auto;margin-right:auto}
.creator-banner{border-left:5px solid #f3b400;background:#fff8dd;padding:14px 18px;border-radius:8px;margin-bottom:22px;font-weight:700}
.auth-tabs{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:10px;padding:6px;gap:6px;margin-bottom:28px;background:#f6f8fa}
.auth-tab{border:0;background:transparent;border-radius:8px;min-height:48px;font-weight:800;cursor:pointer;color:var(--muted)}
.auth-tab.active{background:var(--primary, #3478bf);color:#fff;box-shadow:0 6px 18px rgba(36,75,117,.18)}
.auth-panel h2{font-size:30px;margin:7px 0 8px}
.password-row{display:grid;grid-template-columns:1fr auto;gap:8px}
.show-password{border:1px solid var(--line);background:#fff;border-radius:8px;padding:0 13px;font-weight:700;cursor:pointer}
.realtime-badge{font-size:10px;color:#1d8b5b;background:#e6f7ef;border:1px solid #bfe8d5;padding:5px 8px;border-radius:999px;vertical-align:middle;white-space:nowrap}
.status-active{background:#e6f7ef!important;color:#19724c!important}
@media(max-width:650px){.auth-tabs{grid-template-columns:1fr}.password-row{grid-template-columns:1fr}.show-password{min-height:38px}}

/* ===== Multi-language Learning + Classic/PVP ===== */
.language-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.language-card{border:1px solid var(--line);background:#fff;border-radius:14px;padding:20px;text-align:left;cursor:pointer;transition:.18s}
.language-card:hover,.language-card.selected{border-color:var(--primary,#3478bf);box-shadow:0 10px 28px rgba(36,75,117,.10);transform:translateY(-2px)}
.language-card>span{display:block;font-size:34px}.language-card strong{display:block;font-size:22px;margin:10px 0 3px}.language-card b{display:block;color:var(--primary,#3478bf);font-size:12px}.language-card small{display:block;color:var(--muted);line-height:1.55;margin:10px 0}.language-card em{display:block;font-style:normal;font-size:11px;background:#f6f8fa;padding:9px;border-radius:8px;color:#536171}
.lesson-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px}.lesson-tab{border:1px solid var(--line);background:#f8fafb;border-radius:10px;padding:12px;cursor:pointer;text-align:left}.lesson-tab.active{border-color:var(--primary,#3478bf);background:#eef5fc}.lesson-tab span,.lesson-tab strong,.lesson-tab small{display:block}.lesson-tab strong{margin:5px 0}.lesson-tab small{color:var(--muted)}
.education-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:18px}.edu-info{display:grid;gap:10px}.edu-card{border:1px solid var(--line);border-radius:10px;padding:14px;background:#fafbfc}.edu-card.benefit{background:#f3fbf7}.edu-card h3{font-size:14px;margin:0 0 7px}.edu-card p{font-size:13px;color:#536171;line-height:1.65;margin:0}.edu-heading{margin:0 0 8px}.lesson-code{background:#101820;color:#e7edf5;border-radius:10px;padding:18px;overflow:auto;font:13px/1.7 Consolas,monospace;min-height:210px}.preview-panel{border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:12px;background:#fff}.preview-bar{height:38px;background:#f4f6f8;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px;padding:0 12px}.preview-bar i{width:8px;height:8px;border-radius:50%;background:#aeb7c1}.preview-bar span{font-size:10px;color:var(--muted);margin-left:5px}.preview-panel iframe{width:100%;height:220px;border:0}.terminal-output{margin:0;background:#0c1219;color:#7ee787;min-height:180px;padding:20px;font:13px/1.7 Consolas,monospace}
.two-col{grid-template-columns:repeat(2,1fr)!important}.difficulty-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.difficulty-card{border:1px solid var(--line);background:#fff;border-radius:12px;padding:18px;text-align:center;cursor:pointer}.difficulty-card.selected{border-color:var(--primary,#3478bf);background:#eef5fc}.difficulty-card span,.difficulty-card strong,.difficulty-card small,.difficulty-card b{display:block}.difficulty-card span{font-size:28px}.difficulty-card strong{font-size:18px;margin:8px}.difficulty-card small{color:var(--muted);min-height:36px}.difficulty-card b{margin-top:8px;color:var(--primary,#3478bf);font-size:12px}.config-footer{margin-top:18px;display:flex;justify-content:space-between;align-items:center;gap:12px}.selected-summary{font-size:13px;color:var(--muted)}
.pvp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.pvp-box{border:1px solid var(--line);border-radius:12px;padding:18px;background:#fafbfc}.pvp-box h3{margin:0 0 5px}.pvp-box p{color:var(--muted);font-size:12px}.join-row{display:grid;grid-template-columns:1fr auto;gap:8px}.join-row input{border:1px solid var(--line);border-radius:8px;padding:10px;text-transform:uppercase;letter-spacing:.18em;font-weight:800}
.pvp-lobby{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:18px 0}.pvp-lobby>div{padding:13px;border:1px solid var(--line);border-radius:9px}.pvp-lobby span,.pvp-lobby strong{display:block}.pvp-lobby span{font-size:10px;color:var(--muted)}.pvp-lobby strong{margin-top:5px}
.pvp-progress-board{display:grid;gap:12px;margin:18px 0}.pvp-progress-board>div{display:grid;grid-template-columns:150px 1fr 60px;gap:10px;align-items:center}.pvp-track{height:14px;background:#e6ebf0;border-radius:999px;overflow:hidden}.pvp-track div{height:100%;background:var(--primary,#3478bf);width:0;transition:width .2s}
@media(max-width:950px){.language-grid{grid-template-columns:repeat(2,1fr)}.education-grid{grid-template-columns:1fr}.pvp-lobby{grid-template-columns:repeat(2,1fr)}}
@media(max-width:650px){.language-grid,.lesson-tabs,.difficulty-grid,.pvp-grid{grid-template-columns:1fr}.config-footer{display:block}.config-footer button{margin-top:10px}.pvp-progress-board>div{grid-template-columns:100px 1fr 45px}}

/* ===== V2 Fullscreen Strict Typing / 100 Stages / Points ===== */
.portal-stat-grid{grid-template-columns:repeat(5,1fr)}
.points-stat strong{color:#b87900}.points-stat small{display:block;font-size:9px;color:var(--muted);margin-top:2px}
.language-card.coming-soon{opacity:.55;cursor:not-allowed}
.stage-selector{margin:12px 0 20px;padding:14px;background:#f8fafc;border:1px solid var(--line);border-radius:12px}
.stage-selector-head{display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-bottom:10px}
.mini-stage-grid{display:grid;grid-template-columns:repeat(15,1fr);gap:5px}
.mini-stage-grid button{min-height:30px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:10px;cursor:pointer}
.mini-stage-grid button.selected{background:var(--primary,#3478bf);color:#fff;border-color:var(--primary,#3478bf)}
.mini-stage-grid button:disabled{opacity:.45;cursor:not-allowed}
.stage-panel{margin-top:18px}.stage-panel h3{font-size:14px;margin:0 0 10px}
.classic-stage-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-height:250px;overflow:auto}
.classic-stage{border:1px solid var(--line);border-radius:9px;background:#fff;text-align:left;padding:10px;cursor:pointer}
.classic-stage strong,.classic-stage span,.classic-stage small{display:block}
.classic-stage strong{color:var(--primary,#3478bf);font-size:17px}.classic-stage span{font-size:11px;margin:4px 0}.classic-stage small{font-size:9px;color:var(--muted)}
.classic-stage.selected{border-color:var(--primary,#3478bf);background:#eef5fc}.classic-stage:disabled{opacity:.38;cursor:not-allowed}

.reward-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.reward-card{border:1px solid var(--line);border-radius:12px;padding:18px;background:#fff}
.reward-card.owned{background:#f2fbf6;border-color:#bce4cd}.reward-icon{font-size:30px}.reward-card h3{margin:8px 0}.reward-card p{color:var(--muted);font-size:12px;min-height:38px}.reward-cost{font-weight:900;color:#b87900;margin:10px 0}
.character-placeholder{display:flex;align-items:center;justify-content:space-between;gap:24px;background:linear-gradient(135deg,#f5f8fc,#eef6ff)}
.character-placeholder h2{margin:7px 0}.character-placeholder p{color:var(--muted);max-width:800px;line-height:1.6}.character-silhouette{font-size:72px;filter:grayscale(1);opacity:.55}

body.game-active{overflow:hidden}
body.game-active .site-header,body.game-active footer{display:none!important}
body.game-active main.wrap{width:100%;max-width:none;padding:0;margin:0}
.game-fullscreen{position:fixed;inset:0;z-index:9999;background:#f5f7fa;width:100vw;height:100vh;overflow:hidden}
.game-shell{height:100%;display:grid;grid-template-rows:auto auto minmax(0,1fr);padding:12px 16px;gap:10px}
.fullscreen-topbar{display:flex;align-items:center;justify-content:space-between;gap:14px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:10px 14px}
.game-identity{display:flex;align-items:center;gap:12px;min-width:0}.game-identity>div{min-width:0}.game-identity strong,.game-identity small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.game-identity small{color:var(--muted);font-size:11px;margin-top:2px}
.game-top-actions{display:flex;align-items:center;gap:8px}.small-btn{min-height:34px;padding:0 11px;font-size:11px}
.fullscreen-stats{margin:0;grid-template-columns:repeat(6,1fr);gap:8px}.fullscreen-stats div{padding:8px}.fullscreen-stats strong{font-size:20px}
.game-main-area{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:10px;min-height:0}
.code-side{display:grid;grid-template-rows:auto minmax(0,1fr) auto;min-height:0}
.fullscreen-tags{margin:0 0 7px}.strict-stage{min-height:0;height:100%;display:grid;grid-template-rows:42px minmax(0,1fr);overflow:hidden}
.fullscreen-code{min-height:0!important;max-height:none!important;height:100%;overflow:auto;padding:22px 28px;font-size:clamp(16px,1.45vw,23px);line-height:1.65}
.typing-display .correct{color:#16824f!important;background:#e9f8f0;border-radius:2px}
.typing-display .current{background:#fff3c4;border-left:3px solid #e0a000;padding-left:1px}
.strict-stage.wrong-flash{border-color:#df3b3b!important;box-shadow:0 0 0 4px rgba(223,59,59,.12)}
.compact-progress{margin:6px 0 0}.game-help-side{display:grid;grid-template-rows:auto minmax(0,1fr);gap:8px;min-height:0}
.strict-guide{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px;font-size:11px}.strict-guide h3{margin:0 0 8px;color:var(--primary,#3478bf)}.strict-guide p{margin:5px 0;color:#536171}
.compact-keyboard{overflow:hidden;min-height:0}.compact-keyboard .keyboard{transform:scale(.74);transform-origin:top left;width:135%;}.compact-keyboard p{margin:0 0 5px}
@keyframes wrongShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
.wrong-shake{animation:wrongShake .22s linear}

@media(max-width:1000px){
  .portal-stat-grid{grid-template-columns:repeat(2,1fr)}
  .mini-stage-grid{grid-template-columns:repeat(8,1fr)}
  .classic-stage-grid{grid-template-columns:repeat(3,1fr)}
  .reward-grid{grid-template-columns:repeat(2,1fr)}
  .game-main-area{grid-template-columns:1fr}
  .game-help-side{display:none}
}
@media(max-width:650px){
  .reward-grid,.classic-stage-grid{grid-template-columns:1fr}
  .mini-stage-grid{grid-template-columns:repeat(5,1fr)}
  .fullscreen-topbar{padding:7px}.game-top-actions>span{display:none}
  .fullscreen-stats{grid-template-columns:repeat(3,1fr)}
  .game-shell{padding:6px}
  .fullscreen-code{font-size:14px;padding:14px}
}

/* ===== V3 Token / Official / Ranking ===== */
.portal-stat-grid{grid-template-columns:repeat(6,1fr)}
.rank-stat strong{color:#7a55c8}.rank-stat small{display:block;font-size:9px;color:var(--muted)}
.official-mode{border-color:#e1b84b!important}
.official-mode.selected{background:#fff8dc!important}
.official-summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.official-summary-grid>div{border:1px solid var(--line);border-radius:10px;padding:15px;background:#fafbfc}
.official-summary-grid span,.official-summary-grid strong{display:block}.official-summary-grid span{font-size:10px;color:var(--muted)}.official-summary-grid strong{font-size:24px;margin-top:5px}
.official-stage-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-height:420px;overflow:auto}
.official-stage{border:1px solid var(--line);background:#fff;border-radius:9px;padding:11px;text-align:left;cursor:pointer}
.official-stage span,.official-stage strong,.official-stage small{display:block}.official-stage span{font-size:10px;color:#a67a00}.official-stage strong{font-size:12px;margin:5px 0}.official-stage small{font-size:9px;color:var(--muted)}
.official-stage.completed{border-color:#76bd98;background:#effaf4}.official-actions{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:18px}.official-actions small{color:var(--muted)}
.ranking-season-banner{display:flex;gap:12px;align-items:center;padding:14px;border:1px solid var(--line);border-radius:10px;background:#f8fafb;margin-bottom:14px}.ranking-season-banner span{font-size:12px;color:var(--muted)}
@media(max-width:950px){.portal-stat-grid{grid-template-columns:repeat(3,1fr)}.official-stage-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:650px){.portal-stat-grid{grid-template-columns:repeat(2,1fr)}.official-summary-grid{grid-template-columns:repeat(2,1fr)}.official-stage-grid{grid-template-columns:1fr}.official-actions{display:block}.official-actions small{display:block;margin-top:8px}}


/* ===================================================================
   V3.2 RESPONSIVE UX/UI — DESKTOP / TABLET / MOBILE
   =================================================================== */

:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --tap: 44px;
}

html {
  min-height: 100%;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  min-height: 100%;
  overflow-x: hidden;
}

button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}

button,
.btn,
.auth-tab,
.mode-choice,
.language-card,
.difficulty-card,
.classic-stage,
.official-stage {
  touch-action: manipulation;
}

input,
select,
textarea {
  font-size: max(16px, 1rem); /* ป้องกัน iOS ซูมเองเมื่อแตะ input */
}

/* ---------- COMMON RESPONSIVE SHELL ---------- */
.wrap {
  width: min(1220px, calc(100% - 32px));
}

.card {
  scroll-margin-top: 16px;
}

.form-grid input,
.form-grid select,
.form-grid textarea,
.stack-form input {
  min-height: 46px;
}

.btn {
  min-height: var(--tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.auth-tab {
  min-height: 50px;
}

/* ---------- PORTAL ---------- */
.portal-stat-grid {
  align-items: stretch;
}

.portal-stat {
  min-width: 0;
}

.portal-stat strong {
  overflow-wrap: anywhere;
}

.language-card,
.mode-choice,
.difficulty-card,
.classic-stage,
.official-stage,
.reward-card {
  min-width: 0;
}

/* ---------- FULLSCREEN GAME COMMON ---------- */
.game-fullscreen {
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  min-height: 100dvh;
  overscroll-behavior: none;
  touch-action: manipulation;
}

.game-shell {
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  padding:
    max(10px, var(--safe-top))
    max(12px, var(--safe-right))
    max(10px, var(--safe-bottom))
    max(12px, var(--safe-left));
}

.game-main-area,
.code-side,
.strict-stage,
.fullscreen-code {
  min-height: 0;
}

.fullscreen-code {
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.game-top-actions .btn {
  white-space: nowrap;
}

.device-hint {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f5f7fa;
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
}

.mobile-game-tools,
.mobile-stats-sheet {
  display: none;
}

/* Desktop keyboard remains visible */
@media (min-width: 1101px) {
  .game-main-area {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
  }

  .fullscreen-code {
    font-size: clamp(17px, 1.35vw, 23px);
  }
}

/* ===================================================================
   TABLET / SMALL LAPTOP 701–1100
   =================================================================== */
@media (min-width: 701px) and (max-width: 1100px) {
  .wrap {
    width: min(100% - 24px, 980px);
  }

  .card {
    padding: 22px;
  }

  .header-inner {
    gap: 12px;
  }

  .site-header h1 {
    font-size: 26px;
  }

  .portal-stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .language-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mode-card-grid,
  .difficulty-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .classic-stage-grid,
  .official-stage-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .reward-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .education-grid {
    grid-template-columns: 1fr;
  }

  .game-shell {
    grid-template-rows: auto auto minmax(0,1fr);
  }

  .game-main-area {
    grid-template-columns: minmax(0, 1fr);
  }

  .game-help-side {
    display: none;
  }

  .fullscreen-code {
    padding: 18px 22px;
    font-size: clamp(16px, 2vw, 21px);
  }

  .fullscreen-stats div {
    min-width: 0;
  }
}

/* ===================================================================
   MOBILE <= 700
   =================================================================== */
@media (max-width: 700px) {
  :root {
    --mobile-toolbar-h: 58px;
  }

  body:not(.game-active) {
    padding-left: var(--safe-left);
    padding-right: var(--safe-right);
  }

  .wrap {
    width: min(100% - 20px, 680px);
  }

  .site-header {
    padding:
      max(16px, var(--safe-top))
      0
      14px;
  }

  .header-inner {
    align-items: flex-start;
    gap: 8px;
  }

  .site-header h1 {
    font-size: 22px;
    line-height: 1.25;
  }

  .site-header p {
    font-size: 12px;
  }

  .kicker,
  .section-kicker {
    font-size: 9px;
  }

  .admin-link {
    min-height: 40px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
  }

  main.wrap {
    padding: 14px 0 calc(24px + var(--safe-bottom));
  }

  .card {
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 14px;
  }

  .account-card {
    margin-top: 0;
  }

  .creator-banner {
    font-size: 12px;
    padding: 11px 12px;
  }

  .auth-tabs {
    grid-template-columns: 1fr 1fr;
    margin-bottom: 20px;
  }

  .auth-panel h2,
  .user-portal-head h2,
  .section-title h2 {
    font-size: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-grid .full {
    grid-column: 1;
  }

  .form-grid label span {
    font-size: 12px;
  }

  .form-grid input,
  .form-grid select,
  .form-grid textarea,
  .stack-form input {
    min-height: 50px;
    padding: 12px 13px;
    border-radius: 10px;
  }

  .password-row {
    grid-template-columns: minmax(0,1fr) auto;
  }

  .show-password {
    min-width: 66px;
    min-height: 50px;
  }

  .form-footer {
    display: grid;
    gap: 10px;
  }

  .form-footer .btn {
    width: 100%;
  }

  .user-portal-head {
    display: grid;
    gap: 14px;
  }

  .user-portal-head .btn {
    width: 100%;
  }

  .portal-stat-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }

  .portal-stat {
    padding: 13px;
  }

  .portal-stat span {
    font-size: 10px;
  }

  .portal-stat strong {
    font-size: 23px;
  }

  .language-grid,
  .mode-card-grid,
  .difficulty-grid,
  .reward-grid {
    grid-template-columns: 1fr !important;
  }

  .language-card,
  .mode-choice,
  .difficulty-card {
    min-height: 0;
    padding: 16px;
  }

  .language-card > span,
  .mode-choice-icon {
    font-size: 27px;
  }

  .language-card strong,
  .mode-choice strong {
    font-size: 18px;
  }

  .language-card small,
  .mode-choice small {
    min-height: 0;
  }

  .lesson-tabs {
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 6px;
  }

  .lesson-tab {
    padding: 9px 7px;
    text-align: center;
  }

  .lesson-tab strong {
    font-size: 11px;
  }

  .lesson-tab small {
    font-size: 9px;
  }

  .stage-selector {
    padding: 10px;
  }

  .stage-selector-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .mini-stage-grid {
    grid-template-columns: repeat(5, minmax(0,1fr));
  }

  .mini-stage-grid button {
    min-height: 40px;
  }

  .classic-stage-grid,
  .official-stage-grid {
    grid-template-columns: 1fr;
    max-height: 360px;
  }

  .classic-stage,
  .official-stage {
    min-height: 62px;
  }

  .official-summary-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }

  .official-actions {
    display: grid;
    gap: 8px;
  }

  .official-actions .btn {
    width: 100%;
  }

  .education-grid {
    grid-template-columns: 1fr;
  }

  .lesson-code {
    font-size: 12px;
    min-height: 160px;
    max-height: 320px;
    overflow: auto;
  }

  .preview-panel iframe {
    height: 200px;
  }

  .character-placeholder {
    display: grid;
    text-align: center;
  }

  .character-silhouette {
    font-size: 56px;
  }

  .table-wrap {
    margin-left: -4px;
    margin-right: -4px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 720px;
  }

  /* ---------- MOBILE GAME ---------- */
  body.game-active {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #f5f7fa;
  }

  .game-fullscreen {
    inset: 0;
    height: 100dvh;
    background: #f5f7fa;
  }

  .game-shell {
    height: 100dvh;
    padding:
      max(6px, var(--safe-top))
      max(6px, var(--safe-right))
      calc(var(--mobile-toolbar-h) + max(6px, var(--safe-bottom)))
      max(6px, var(--safe-left));
    grid-template-rows: auto auto minmax(0,1fr);
    gap: 6px;
  }

  .fullscreen-topbar {
    border-radius: 9px;
    padding: 7px 9px;
    min-height: 47px;
  }

  .game-identity {
    width: 100%;
  }

  .game-identity .badge {
    flex: 0 0 auto;
    font-size: 9px;
    padding: 5px 7px;
  }

  .game-identity strong {
    font-size: 12px;
  }

  .game-identity small {
    display: none;
  }

  .game-top-actions {
    display: none;
  }

  .fullscreen-stats {
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 4px;
  }

  .fullscreen-stats div {
    padding: 5px 3px;
    border-radius: 7px;
  }

  .fullscreen-stats span {
    font-size: 8px;
  }

  .fullscreen-stats strong {
    font-size: 15px;
    margin-top: 2px;
  }

  .game-main-area {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .game-help-side {
    display: none !important;
  }

  .fullscreen-tags {
    display: none;
  }

  .code-side {
    grid-template-rows: minmax(0,1fr) auto;
  }

  .strict-stage {
    grid-template-rows: 36px minmax(0,1fr);
    border-radius: 9px;
  }

  .editor-bar {
    height: 36px;
    min-height: 36px;
    padding: 0 8px;
    grid-template-columns: auto minmax(0,1fr) auto;
    gap: 6px;
  }

  .editor-dots {
    gap: 3px;
  }

  .editor-dots i {
    width: 6px;
    height: 6px;
  }

  .editor-bar > span {
    font-size: 9px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .fullscreen-code {
    padding: 12px 11px 24px;
    font-size: clamp(14px, 4vw, 18px);
    line-height: 1.62;
    overscroll-behavior: contain;
  }

  .compact-progress {
    margin: 4px 2px 0;
    gap: 8px;
  }

  .compact-progress .progress-track {
    height: 6px;
  }

  .compact-progress span {
    min-width: 68px;
    font-size: 9px;
  }

  .typing-display .current {
    border-left-width: 2px;
  }

  .mobile-game-tools {
    position: fixed;
    left: max(6px, var(--safe-left));
    right: max(6px, var(--safe-right));
    bottom: max(6px, var(--safe-bottom));
    z-index: 10020;
    height: var(--mobile-toolbar-h);
    display: grid;
    grid-template-columns: 1.35fr 1fr .8fr;
    gap: 6px;
    padding: 6px;
    background: rgba(255,255,255,.96);
    border: 1px solid var(--line);
    border-radius: 14px;
    box-shadow: 0 -8px 30px rgba(20,40,60,.12);
    backdrop-filter: blur(12px);
  }

  .mobile-tool-btn {
    min-height: 44px;
    border: 0;
    border-radius: 10px;
    background: #eaf2fa;
    color: #244b75;
    font-weight: 800;
    font-size: 12px;
  }

  .mobile-tool-btn:first-child {
    background: var(--blue, #244b75);
    color: #fff;
  }

  .mobile-tool-btn.danger-lite {
    background: #fdecec;
    color: #a94141;
  }

  .mobile-stats-sheet {
    position: fixed;
    inset: 0;
    z-index: 10030;
    display: grid;
    align-items: end;
    padding:
      16px
      max(10px, var(--safe-right))
      max(10px, var(--safe-bottom))
      max(10px, var(--safe-left));
    background: rgba(15,25,35,.36);
    backdrop-filter: blur(3px);
  }

  .mobile-stats-sheet.hidden {
    display: none !important;
  }

  .mobile-sheet-card {
    width: 100%;
    background: #fff;
    border-radius: 18px;
    padding: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,.22);
  }

  .mobile-sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .mobile-sheet-head button {
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 10px;
    background: #f2f4f7;
  }

  .mobile-stats-grid {
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 8px;
  }

  .mobile-stats-grid > div {
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 11px 8px;
    text-align: center;
  }

  .mobile-stats-grid span,
  .mobile-stats-grid strong {
    display: block;
  }

  .mobile-stats-grid span {
    color: var(--muted);
    font-size: 9px;
  }

  .mobile-stats-grid strong {
    margin-top: 4px;
    font-size: 18px;
    color: var(--blue, #244b75);
  }

  /* Native keyboard can resize viewport — keep editor usable */
  @supports (height: 100dvh) {
    .game-fullscreen,
    .game-shell {
      height: 100dvh;
    }
  }
}

/* ===================================================================
   MOBILE LANDSCAPE: optimize for physical / soft keyboard typing
   =================================================================== */
@media (max-width: 900px) and (orientation: landscape) {
  .game-shell {
    padding:
      max(4px, var(--safe-top))
      max(5px, var(--safe-right))
      calc(50px + max(4px, var(--safe-bottom)))
      max(5px, var(--safe-left));
    gap: 4px;
  }

  .fullscreen-topbar {
    min-height: 38px;
    padding: 4px 7px;
  }

  .fullscreen-stats {
    grid-template-columns: repeat(6, minmax(0,1fr));
  }

  .fullscreen-stats div {
    padding: 3px;
  }

  .fullscreen-stats strong {
    font-size: 13px;
  }

  .strict-stage {
    grid-template-rows: 30px minmax(0,1fr);
  }

  .editor-bar {
    height: 30px;
    min-height: 30px;
  }

  .fullscreen-code {
    font-size: clamp(13px, 2.2vw, 17px);
    padding: 8px 10px 18px;
    line-height: 1.48;
  }

  .mobile-game-tools {
    height: 48px;
    padding: 4px;
  }

  .mobile-tool-btn {
    min-height: 38px;
  }
}

/* Very small phones */
@media (max-width: 380px) {
  .wrap {
    width: calc(100% - 14px);
  }

  .card {
    padding: 13px;
  }

  .portal-stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .portal-stat strong {
    font-size: 20px;
  }

  .fullscreen-stats span {
    font-size: 7px;
  }

  .fullscreen-stats strong {
    font-size: 13px;
  }

  .fullscreen-code {
    font-size: 13px;
  }

  .mobile-game-tools {
    grid-template-columns: 1.4fr .9fr .7fr;
  }

  .mobile-tool-btn {
    font-size: 10px;
  }
}

/* ===================================================================
   ADMIN RESPONSIVE
   =================================================================== */
@media (max-width: 900px) {
  .admin-wrap {
    width: min(100% - 20px, 900px);
    padding-top: 14px !important;
  }

  .admin-titlebar {
    display: grid;
    gap: 14px;
    padding: 18px;
  }

  .admin-titlebar > div:last-child {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .admin-metrics {
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 8px;
  }

  .admin-metrics div {
    padding: 14px;
  }

  .admin-metrics strong {
    font-size: 24px;
  }

  .admin-tabs {
    position: sticky;
    top: 0;
    z-index: 30;
    overflow-x: auto;
    white-space: nowrap;
    padding: 6px 0;
    background: var(--bg);
    scrollbar-width: none;
  }

  .admin-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab {
    min-height: 44px;
    flex: 0 0 auto;
  }

  .admin-tab-panel {
    padding: 16px;
  }

  .panel-title {
    display: grid;
    gap: 12px;
  }

  .panel-title .button-row,
  .button-row {
    width: 100%;
  }

  .panel-title .button-row .btn {
    flex: 1 1 auto;
  }

  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid var(--line);
    border-radius: 10px;
  }

  .table-wrap table {
    min-width: 920px;
  }
}

@media (max-width: 600px) {
  .admin-login {
    margin: 8px auto;
    padding: 18px;
  }

  .admin-titlebar > div:last-child {
    grid-template-columns: 1fr;
  }

  .admin-metrics {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .admin-level-form {
    padding: 12px;
  }

  .ranking-season-banner {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}

/* Accessibility / motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}


/* ===================================================================
   V3.3 PVP MATCHMAKING — AUTO CODE / RANDOM ROOM SEARCH
   =================================================================== */
.pvp-match-actions{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:14px;
}

.pvp-match-card{
  min-height:180px;
  border:1px solid var(--line);
  border-radius:16px;
  background:#fff;
  padding:22px;
  text-align:left;
  cursor:pointer;
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
}

.pvp-match-card:hover:not(:disabled){
  transform:translateY(-2px);
  border-color:var(--primary,#3478bf);
  box-shadow:0 12px 30px rgba(36,75,117,.11);
}

.pvp-match-card:disabled{
  opacity:.55;
  cursor:not-allowed;
}

.pvp-match-card.create{
  background:linear-gradient(145deg,#ffffff,#f3f9ff);
}

.pvp-match-card.find{
  background:linear-gradient(145deg,#ffffff,#f5fbf7);
}

.pvp-match-icon,
.pvp-match-card strong,
.pvp-match-card small,
.pvp-match-card em{
  display:block;
}

.pvp-match-icon{
  font-size:34px;
  margin-bottom:13px;
}

.pvp-match-card strong{
  font-size:20px;
}

.pvp-match-card small{
  color:var(--muted);
  line-height:1.6;
  margin:8px 0 14px;
  min-height:42px;
}

.pvp-match-card em{
  width:max-content;
  max-width:100%;
  padding:5px 8px;
  border-radius:999px;
  background:#edf3f8;
  color:#486277;
  font-size:9px;
  font-style:normal;
  font-weight:800;
  letter-spacing:.04em;
}

.matchmaking-status{
  display:grid;
  grid-template-columns:auto 1fr;
  column-gap:9px;
  row-gap:2px;
  align-items:center;
  margin-top:14px;
  padding:13px 15px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#f8fafc;
}

.matchmaking-dot{
  grid-row:1 / span 2;
  width:10px;
  height:10px;
  border-radius:50%;
  background:#8293a3;
}

.matchmaking-status strong{
  font-size:13px;
}

.matchmaking-status small{
  color:var(--muted);
  font-size:11px;
}

.matchmaking-status[data-state="searching"] .matchmaking-dot{
  background:#3378c4;
  box-shadow:0 0 0 5px rgba(51,120,196,.10);
  animation:pvpPulse 1s infinite alternate;
}

.matchmaking-status[data-state="waiting"] .matchmaking-dot{
  background:#dca300;
}

.matchmaking-status[data-state="matched"] .matchmaking-dot,
.matchmaking-status[data-state="playing"] .matchmaking-dot{
  background:#219364;
}

.matchmaking-status[data-state="error"] .matchmaking-dot,
.matchmaking-status[data-state="closed"] .matchmaking-dot{
  background:#d04747;
}

.matchmaking-status[data-state="empty"] .matchmaking-dot{
  background:#a6792b;
}

@keyframes pvpPulse{
  from{transform:scale(.9);opacity:.65}
  to{transform:scale(1.15);opacity:1}
}

.pvp-lobby-v2{
  grid-template-columns:1.35fr repeat(3,minmax(0,1fr));
  margin-top:16px;
}

.pvp-lobby-v2 > div{
  min-width:0;
}

.room-code-card{
  background:#0f2438!important;
  color:#fff;
}

.room-code-card > span,
.room-code-card > strong,
.room-code-card > small{
  display:block;
}

.room-code-card > span{
  font-size:9px!important;
  color:#9fc5e8!important;
}

.room-code-card > strong{
  margin:6px 0!important;
  font-size:28px!important;
  letter-spacing:.18em;
  color:#fff;
}

.room-code-card > small{
  font-size:9px;
  color:#bcd0df;
}

.pvp-player-slot small,
.pvp-status-slot small{
  display:block;
  margin-top:5px;
  color:var(--muted);
  font-size:9px;
}

.pvp-lobby-actions{
  display:flex;
  align-items:center;
  gap:8px;
  margin-top:12px;
}

@media(max-width:800px){
  .pvp-match-actions{
    grid-template-columns:1fr;
  }

  .pvp-match-card{
    min-height:0;
    padding:17px;
  }

  .pvp-lobby-v2{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
}

@media(max-width:520px){
  .pvp-lobby-v2{
    grid-template-columns:1fr;
  }

  .pvp-lobby-actions{
    display:grid;
    grid-template-columns:1fr;
  }

  .pvp-lobby-actions .btn{
    width:100%;
  }

  .room-code-card > strong{
    font-size:24px!important;
  }
}

/* ===== V3.4 COMMUNITY / TOP10 / RANK SHIELDS / 2D ZONE ===== */
.social-hub-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:16px}.section-title.compact{margin-bottom:14px}.online-count-pill{display:flex;align-items:center;gap:7px;background:#eff9f3;border:1px solid #cde7d5;padding:7px 10px;border-radius:999px;font-size:10px;color:#33714e;white-space:nowrap}.online-dot{width:8px;height:8px;border-radius:50%;background:#20a566;display:inline-block;box-shadow:0 0 0 4px rgba(32,165,102,.12)}
.community-players-list{display:grid;gap:7px;max-height:520px;overflow:auto}.community-player-row{display:grid;grid-template-columns:40px minmax(0,1fr) auto 60px;gap:9px;align-items:center;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:#fafcfd}.community-player-row.me{background:#edf5fc;border-color:#bdd4ea}.community-player-row.offline{opacity:.68}.community-avatar{width:38px;height:38px;border-radius:11px;background:#244b75;color:#fff;display:grid;place-items:center;font-weight:900}.community-player-info strong,.community-player-info small{display:block}.community-player-info strong{font-size:12px}.community-player-info small{font-size:9px;color:var(--muted);margin-top:2px}.community-player-info em{font-size:7px;font-style:normal;background:#244b75;color:#fff;padding:2px 5px;border-radius:999px;margin-left:4px}.community-status{font-size:7px;font-weight:900;text-align:right}.community-status.on{color:#168355}.community-status.off{color:#8b99a5}
.top-ranking-list{display:grid;gap:6px}.ranking-row{display:grid;grid-template-columns:42px 42px minmax(0,1fr) 74px;gap:8px;align-items:center;min-height:58px;padding:8px 11px;border:1px solid var(--line);border-radius:10px;background:#fff}.ranking-row.podium-1{background:linear-gradient(90deg,#fff9df,#fff);border-color:#ead487}.ranking-row.podium-2{background:linear-gradient(90deg,#f3f5f7,#fff);border-color:#ced4da}.ranking-row.podium-3{background:linear-gradient(90deg,#fbf1e9,#fff);border-color:#ddbea6}.ranking-position{font-size:20px;font-weight:900;color:#415466;text-align:center}.ranking-player strong,.ranking-player small{display:block}.ranking-player strong{font-size:12px}.ranking-player small{font-size:9px;color:var(--muted);margin-top:2px}.ranking-rating{text-align:right}.ranking-rating strong,.ranking-rating small{display:block}.ranking-rating strong{font-size:19px;color:#244b75}.ranking-rating small{font-size:8px;color:var(--muted)}.season-chip{background:#eef3f9;border:1px solid #d8e2ec;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;color:#244b75}
.rank-shield{--shield:#9b6b43;position:relative;display:inline-grid;place-items:center;width:34px;height:38px;color:#fff;font-weight:1000;vertical-align:middle;background:var(--shield);clip-path:polygon(10% 0,90% 0,100% 58%,50% 100%,0 58%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.16))}.rank-shield::before{content:"";position:absolute;inset:4px;clip-path:inherit;border:1px solid rgba(255,255,255,.62)}.rank-shield-letter{position:relative;z-index:1;font-size:13px}.rank-shield.small{width:27px;height:31px}.rank-shield.small .rank-shield-letter{font-size:10px}.rank-bronze{--shield:#9b6b43}.rank-silver{--shield:#8795a5}.rank-gold{--shield:#d6a51d}.rank-platinum{--shield:#3ca7a7}.rank-diamond{--shield:#557fd8}.rank-master{--shield:#7b4bc4}.rank-shield-legend{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}.rank-shield-legend>div{display:flex;align-items:center;gap:5px;font-size:8px;color:#607485}.rank-shield-legend b{font-size:8px}
#userRank{display:flex;align-items:center;justify-content:center;gap:5px}
.zone-entry-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:30px;align-items:center;background:linear-gradient(135deg,#0f273b,#1f5476);color:#fff;overflow:hidden}.zone-entry-card .section-kicker{color:#a9d6f5}.zone-entry-card h2{font-size:27px;margin:6px 0 8px}.zone-entry-card p{max-width:760px;color:#d3e4ef;line-height:1.65}.zone-feature-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}.zone-feature-pills span{font-size:9px;padding:5px 8px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(255,255,255,.08)}.zone-entry-actions{display:grid;justify-items:center;gap:10px}.zone-preview-mini{position:relative;width:170px;height:76px;background:#b9d2b0;border-radius:15px;border:3px solid rgba(255,255,255,.25)}.mini-avatar{position:absolute;width:31px;height:31px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:900;border:2px solid #fff}.mini-avatar.a{left:25px;top:23px;background:#245b8d}.mini-avatar.b{left:72px;top:12px;background:#9d584d}.mini-avatar.c{left:113px;top:32px;background:#55734b}.zone-enter-btn{min-width:170px}
.zone-page{margin:0;background:#0c1720;overflow:hidden;color:#183144}.zone-gate{height:100vh;display:grid;place-items:center;background:radial-gradient(circle at center,#244b75,#0b1924)}.zone-gate-card{width:min(430px,calc(100% - 40px));padding:40px;text-align:center;background:#fff;border-radius:20px;box-shadow:0 30px 90px rgba(0,0,0,.28)}.zone-logo{font-size:52px}.zone-gate-card h1{margin:10px 0}.zone-gate-card p{color:#6b7c8d;margin-bottom:20px}.zone-app{height:100vh;display:grid;grid-template-rows:70px minmax(0,1fr);background:#eaf0f3}.zone-hud-top{display:grid;grid-template-columns:1fr auto auto;gap:22px;align-items:center;padding:0 18px;background:#10293c;color:#fff;border-bottom:1px solid rgba(255,255,255,.12)}.zone-brand,.zone-player-hud{display:flex;align-items:center;gap:10px}.zone-brand-icon{width:40px;height:40px;border-radius:11px;background:#2e6c98;display:grid;place-items:center;font-size:22px}.zone-brand strong,.zone-brand small,.zone-player-hud strong,.zone-player-hud small{display:block}.zone-brand strong{font-size:12px;letter-spacing:.05em}.zone-brand small{font-size:9px;color:#9eb9cc;margin-top:2px}.zone-player-hud{padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.06)}.zone-player-hud strong{font-size:11px}.zone-player-hud small{font-size:8px;color:#a9c2d4;margin-top:2px}.zone-player-hud .online-dot{width:6px;height:6px;box-shadow:none;margin-right:3px}.zone-layout{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:10px;padding:10px;min-height:0}.zone-world-wrap{position:relative;min-width:0;min-height:0;background:#8ca588;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(18,37,51,.13)}#zoneCanvas{display:block;width:100%;height:100%;outline:none}.zone-control-help{position:absolute;left:12px;bottom:12px;display:flex;align-items:center;gap:7px;background:rgba(13,32,46,.88);color:#fff;padding:8px 10px;border-radius:9px;font-size:9px;backdrop-filter:blur(7px)}.zone-control-help strong{color:#81b8de}.zone-control-help span{padding:3px 6px;background:rgba(255,255,255,.08);border-radius:5px}.zone-sidebar{display:grid;grid-template-rows:minmax(0,1fr) auto auto;gap:8px;min-height:0}.zone-side-card{background:#fff;border:1px solid #d8e1e7;border-radius:11px;padding:12px;min-height:0}.zone-side-card.players{display:grid;grid-template-rows:auto minmax(0,1fr)}.zone-side-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:9px;border-bottom:1px solid #e6ebef}.zone-side-head span,.zone-side-head strong{display:block}.zone-side-head span{font-size:8px;color:#7a8d9b}.zone-side-head strong{font-size:12px;margin-top:2px}.zone-side-head b{min-width:28px;height:28px;border-radius:8px;background:#edf4f9;color:#244b75;display:grid;place-items:center;font-size:12px}.zone-player-list{overflow:auto;padding-top:7px}.zone-player-row{display:grid;grid-template-columns:35px minmax(0,1fr) auto;gap:7px;align-items:center;padding:7px;border-radius:8px}.zone-player-row:hover{background:#f5f8fa}.zone-player-row.me{background:#eaf3fa}.zone-list-avatar{width:33px;height:33px;border-radius:50%;display:grid;place-items:center;color:#fff;background:hsl(var(--avatar-hue) 48% 48%);font-size:10px;font-weight:900}.zone-player-row strong,.zone-player-row small{display:block}.zone-player-row strong{font-size:10px}.zone-player-row small{font-size:8px;color:#7c8e9b;margin-top:2px}.zone-player-row em{font-size:6px;font-style:normal;background:#244b75;color:#fff;padding:2px 4px;border-radius:4px}.zone-character-preview{display:flex;align-items:center;gap:10px;margin-top:10px}.zone-character-preview-avatar{width:54px;height:54px;border-radius:16px;background:#245b8d;color:#fff;display:grid;place-items:center;font-size:20px;font-weight:900}.zone-character-preview strong,.zone-character-preview small{display:block}.zone-character-preview strong{font-size:11px}.zone-character-preview small{font-size:8px;color:#7a8d9b;margin-top:3px}.zone-side-note{font-size:8px;line-height:1.5;color:#7a8d9b;margin:9px 0 0}.zone-map-legend{display:grid;gap:6px;margin-top:9px}.zone-map-legend span{font-size:9px;color:#617482;display:flex;align-items:center;gap:6px}.zone-map-legend i{width:9px;height:9px;border-radius:50%;display:inline-block}.legend-me{background:#245b8d}.legend-player{background:#9d584d}.legend-object{background:#8c9b91;border-radius:2px!important}
@media(max-width:1200px){.social-hub-grid{grid-template-columns:1fr}.rank-shield-legend{grid-template-columns:repeat(3,1fr)}.zone-layout{grid-template-columns:minmax(0,1fr) 270px}}


/* ==================================================================
   V3.5 THAI NIGHT SOCIAL ZONE
   Minimal: character + left/right movement + speech bubbles
   ================================================================== */
.social-zone-page{
  margin:0;
  width:100vw;
  height:100vh;
  overflow:hidden;
  background:#071826;
  color:#183144;
}
.social-zone-gate{
  position:fixed;inset:0;display:grid;place-items:center;
  background:radial-gradient(circle at 50% 25%,#164a68,#061521 65%);
}
.social-gate-card{
  width:min(440px,calc(100% - 40px));
  padding:42px;text-align:center;background:#fff;border-radius:22px;
  box-shadow:0 30px 100px rgba(0,0,0,.35);
}
.social-gate-icon{font-size:56px}
.social-gate-card h1{margin:10px 0 8px}
.social-gate-card p{color:#6b7c8d;margin-bottom:18px}

.social-zone-app{
  width:100vw;height:100vh;
  display:grid;
  grid-template-rows:68px minmax(0,1fr) 88px;
  background:#091b29;
}
.social-zone-topbar{
  display:grid;
  grid-template-columns:1fr auto auto;
  gap:18px;
  align-items:center;
  padding:0 18px;
  color:#fff;
  background:linear-gradient(180deg,#0b263a,#081d2d);
  border-bottom:1px solid rgba(255,255,255,.11);
}
.social-zone-brand,.social-zone-me{display:flex;align-items:center;gap:10px}
.social-zone-logo{
  width:42px;height:42px;border-radius:12px;display:grid;place-items:center;
  background:#143a54;font-size:23px
}
.social-zone-brand strong,.social-zone-brand small,
.social-zone-me strong,.social-zone-me small{display:block}
.social-zone-brand strong{font-size:12px;letter-spacing:.08em}
.social-zone-brand small,.social-zone-me small{font-size:9px;color:#9fb9ca;margin-top:2px}
.social-zone-me{padding:7px 11px;border-radius:11px;background:rgba(255,255,255,.06)}

.social-world-shell{
  position:relative;min-height:0;overflow:hidden;background:#132d3e;
}
#socialCanvas{
  display:block;width:100%;height:100%;
  cursor:pointer;
}
.social-help-chip{
  position:absolute;left:14px;top:14px;
  display:flex;gap:7px;align-items:center;
  padding:8px 11px;border-radius:10px;
  background:rgba(5,18,28,.78);color:#d9e9f3;
  backdrop-filter:blur(8px);font-size:9px;
  border:1px solid rgba(255,255,255,.08)
}
.social-help-chip b{color:#ffd46d}

.social-zone-controls{
  display:grid;
  grid-template-columns:100px minmax(0,760px) 100px;
  justify-content:center;
  gap:12px;
  align-items:center;
  padding:10px 18px;
  background:linear-gradient(180deg,#102c40,#071b29);
  border-top:1px solid rgba(255,255,255,.12);
}
.move-button{
  height:62px;
  border:1px solid rgba(255,255,255,.14);
  border-radius:16px;
  background:linear-gradient(180deg,#285e80,#173d59);
  color:#fff;font-size:30px;font-weight:900;
  cursor:pointer;
  box-shadow:inset 0 1px rgba(255,255,255,.12),0 5px 18px rgba(0,0,0,.22);
}
.move-button:active{transform:translateY(2px);background:#153950}
.zone-chat-form{
  height:62px;display:grid;grid-template-columns:minmax(0,1fr) 90px;
  gap:8px;padding:7px;border-radius:16px;background:#f5efe2;
  border:3px solid #8b6537;
  box-shadow:0 6px 22px rgba(0,0,0,.23);
}
.zone-chat-form input{
  border:0;outline:0;background:#fffaf0;border-radius:10px;
  padding:0 14px;font-size:15px;color:#3a3025;
}
.zone-chat-form button{
  border:0;border-radius:10px;
  background:linear-gradient(180deg,#8bb53c,#527c24);
  color:#fff;font-weight:900;font-size:14px;cursor:pointer;
}
.zone-chat-form button:hover{filter:brightness(1.06)}

.player-profile-card{
  position:absolute;right:18px;top:18px;
  width:280px;padding:18px;border-radius:16px;
  background:rgba(255,250,236,.97);
  border:3px solid #8c6536;
  box-shadow:0 18px 50px rgba(0,0,0,.28);
}
.player-profile-card>button{
  position:absolute;right:9px;top:9px;
  width:31px;height:31px;border:0;border-radius:8px;background:#eadfc9;cursor:pointer
}
.player-profile-card h3{margin:8px 0 3px}
.player-profile-card p{margin:0 0 13px;color:#6f604f;font-size:11px}
.profile-items-title{display:block;font-size:9px;color:#88745d;margin-bottom:7px}
.profile-showcase-items{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.profile-item{
  min-height:70px;border:1px solid #dbc9aa;border-radius:10px;
  background:#fffaf1;display:grid;place-items:center;text-align:center;padding:5px
}
.profile-item span{font-size:25px}.profile-item small{font-size:8px;color:#6e604f}
.profile-no-items{grid-column:1/-1;padding:13px;background:#f3eadb;border-radius:9px;font-size:9px;color:#83715d}

.gender-setup{
  position:fixed;inset:0;z-index:20000;
  display:grid;place-items:center;background:rgba(3,13,21,.68);backdrop-filter:blur(5px)
}
.gender-card{
  width:520px;max-width:calc(100% - 40px);
  background:#fff9ec;border:4px solid #8e6737;border-radius:20px;
  padding:28px;text-align:center;box-shadow:0 28px 80px rgba(0,0,0,.4)
}
.gender-card h2{margin:7px 0}.gender-card p{font-size:11px;color:#746453;line-height:1.6}
.gender-options{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
.gender-options button{
  min-height:190px;border:2px solid #d9c39e;border-radius:15px;background:#fffef8;cursor:pointer
}
.gender-options button:hover{border-color:#537fa0;background:#f4f9fc}
.gender-options strong{display:block;margin-top:8px;font-size:16px}
.gender-preview{position:relative;width:85px;height:120px;margin:auto}
.gender-preview .head{position:absolute;left:25px;top:5px;width:38px;height:38px;border-radius:50%;background:#efc8a5}
.gender-preview .body{position:absolute;left:18px;top:43px;width:52px;height:42px;border-radius:12px;background:#f3f0e8;border-bottom:9px solid #294c78}
.gender-preview .legs{position:absolute;left:24px;top:83px;width:40px;height:27px;border-left:10px solid #e6c29e;border-right:10px solid #e6c29e}
.male-preview::before,.female-preview::before{
  content:"";position:absolute;z-index:3;background:#2a211f
}
.male-preview::before{left:23px;top:2px;width:42px;height:19px;border-radius:20px 20px 6px 6px}
.female-preview::before{left:20px;top:2px;width:48px;height:53px;border-radius:24px 24px 18px 18px}
.female-preview::after{content:"";position:absolute;z-index:4;left:58px;top:0;width:10px;height:12px;background:#345c8a;border-radius:4px}

@media(max-width:900px){
  .social-zone-topbar{grid-template-columns:1fr auto}
  .social-zone-me{display:none}
  .social-zone-controls{grid-template-columns:75px minmax(0,1fr) 75px;padding:8px}
  .move-button{height:58px}
  .zone-chat-form{height:58px}
}


/* ==================================================================
   V3.6 RESPONSIVE SOCIAL ZONE
   DESKTOP FIRST — TABLET & MOBILE COMPATIBLE
   ================================================================== */

:root{
  --zone-safe-top: env(safe-area-inset-top, 0px);
  --zone-safe-right: env(safe-area-inset-right, 0px);
  --zone-safe-bottom: env(safe-area-inset-bottom, 0px);
  --zone-safe-left: env(safe-area-inset-left, 0px);
  --zone-visible-height: 100dvh;
}

html,body.social-zone-page{
  overscroll-behavior:none;
  -webkit-overflow-scrolling:auto;
}

.social-zone-page{
  min-height:100vh;
  min-height:100dvh;
}

.social-zone-app{
  height:100vh;
  height:100dvh;
  min-height:0;
}

.zone-device-hint{
  display:inline-flex;
  align-items:center;
  min-height:22px;
  padding:0 7px;
  margin-right:2px;
  border:1px solid rgba(255,255,255,.13);
  border-radius:999px;
  font-size:7px;
  letter-spacing:.08em;
  color:#a9c5d8;
  background:rgba(255,255,255,.05);
  white-space:nowrap;
}

.mobile-zone-online{
  display:none;
}

/* ---------------- DESKTOP FULL EXPERIENCE ---------------- */
@media (min-width:1101px){
  .social-zone-app{
    grid-template-rows:68px minmax(0,1fr) 88px;
  }

  .social-zone-topbar{
    padding-left:max(18px,var(--zone-safe-left));
    padding-right:max(18px,var(--zone-safe-right));
  }

  .social-world-shell{
    min-height:520px;
  }

  .social-zone-controls{
    padding:
      10px max(18px,var(--zone-safe-right))
      max(10px,var(--zone-safe-bottom))
      max(18px,var(--zone-safe-left));
  }

  .move-button{
    width:100px;
  }

  .zone-chat-form{
    width:100%;
  }

  #socialCanvas{
    image-rendering:auto;
  }

  .player-profile-card{
    width:300px;
  }
}

/* ---------------- TABLET ---------------- */
@media (min-width:701px) and (max-width:1100px){
  .social-zone-app{
    grid-template-rows:60px minmax(0,1fr) 82px;
    height:100dvh;
  }

  .social-zone-topbar{
    grid-template-columns:minmax(0,1fr) auto auto;
    gap:10px;
    padding:
      max(6px,var(--zone-safe-top))
      max(10px,var(--zone-safe-right))
      6px
      max(10px,var(--zone-safe-left));
  }

  .social-zone-brand strong{
    font-size:11px;
  }

  .social-zone-brand small{
    font-size:8px;
  }

  .social-zone-me{
    padding:5px 8px;
  }

  .social-zone-me strong{
    max-width:150px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .social-world-shell{
    min-height:0;
  }

  #socialCanvas{
    touch-action:manipulation;
  }

  .social-help-chip{
    left:10px;
    top:10px;
    max-width:calc(100% - 20px);
    font-size:8px;
  }

  .social-zone-controls{
    grid-template-columns:84px minmax(0,1fr) 84px;
    gap:8px;
    padding:
      8px max(10px,var(--zone-safe-right))
      max(8px,var(--zone-safe-bottom))
      max(10px,var(--zone-safe-left));
  }

  .move-button{
    height:60px;
    font-size:28px;
    border-radius:14px;
  }

  .zone-chat-form{
    height:60px;
    grid-template-columns:minmax(0,1fr) 82px;
  }

  .zone-chat-form input{
    font-size:16px;
  }

  .player-profile-card{
    right:10px;
    top:10px;
    width:270px;
    max-height:calc(100% - 20px);
    overflow:auto;
  }

  .gender-card{
    width:500px;
  }
}

/* ---------------- MOBILE ---------------- */
@media (max-width:700px){
  html,body.social-zone-page{
    width:100%;
    height:var(--zone-visible-height);
    min-height:320px;
    overflow:hidden;
    position:fixed;
    inset:0;
  }

  .social-zone-app{
    width:100%;
    height:var(--zone-visible-height);
    min-height:320px;
    grid-template-rows:52px minmax(0,1fr) 76px;
  }

  .social-zone-topbar{
    grid-template-columns:minmax(0,1fr) auto auto;
    gap:6px;
    min-height:52px;
    padding:
      max(4px,var(--zone-safe-top))
      max(6px,var(--zone-safe-right))
      4px
      max(6px,var(--zone-safe-left));
  }

  .social-zone-logo{
    width:34px;
    height:34px;
    border-radius:9px;
    font-size:18px;
  }

  .zone-device-hint{
    display:none;
  }

  .social-zone-brand{
    min-width:0;
    gap:7px;
  }

  .social-zone-brand>div{
    min-width:0;
  }

  .social-zone-brand strong{
    display:block;
    font-size:9px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .social-zone-brand small{
    display:none;
  }

  .social-zone-me{
    display:none!important;
  }

  .mobile-zone-online{
    display:flex;
    align-items:center;
    gap:5px;
    height:34px;
    padding:0 8px;
    border-radius:9px;
    background:rgba(255,255,255,.06);
    color:#fff;
    font-size:10px;
  }

  .mobile-zone-online .online-dot{
    width:6px;
    height:6px;
    box-shadow:none;
  }

  .social-zone-topbar .small-btn{
    min-height:34px;
    height:34px;
    padding:0 8px;
    font-size:9px;
    border-radius:8px;
  }

  .social-world-shell{
    min-height:0;
  }

  #socialCanvas{
    width:100%;
    height:100%;
    touch-action:manipulation;
  }

  .social-help-chip{
    display:none;
  }

  .social-zone-controls{
    grid-template-columns:58px minmax(0,1fr) 58px;
    gap:6px;
    min-height:76px;
    padding:
      6px max(6px,var(--zone-safe-right))
      max(6px,var(--zone-safe-bottom))
      max(6px,var(--zone-safe-left));
  }

  .move-button{
    width:58px;
    height:58px;
    min-height:58px;
    padding:0;
    border-radius:14px;
    font-size:24px;
    touch-action:none;
    user-select:none;
  }

  .zone-chat-form{
    min-width:0;
    height:58px;
    grid-template-columns:minmax(0,1fr) 58px;
    gap:5px;
    padding:5px;
    border-width:2px;
    border-radius:13px;
  }

  .zone-chat-form input{
    min-width:0;
    width:100%;
    font-size:16px;
    padding:0 9px;
    border-radius:8px;
  }

  .zone-chat-form button{
    min-width:58px;
    font-size:11px;
    border-radius:8px;
  }

  .player-profile-card{
    position:absolute;
    left:7px;
    right:7px;
    top:auto;
    bottom:7px;
    width:auto;
    max-height:55%;
    overflow:auto;
    padding:13px;
    border-width:2px;
    border-radius:14px;
  }

  .profile-showcase-items{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }

  .gender-setup{
    padding:
      max(10px,var(--zone-safe-top))
      max(10px,var(--zone-safe-right))
      max(10px,var(--zone-safe-bottom))
      max(10px,var(--zone-safe-left));
  }

  .gender-card{
    width:100%;
    max-width:430px;
    max-height:calc(var(--zone-visible-height) - 20px);
    overflow:auto;
    padding:18px;
    border-width:3px;
    border-radius:16px;
  }

  .gender-card h2{
    font-size:20px;
  }

  .gender-options{
    gap:8px;
    margin-top:12px;
  }

  .gender-options button{
    min-height:145px;
  }

  .gender-preview{
    transform:scale(.8);
    transform-origin:center;
    margin-top:-8px;
    margin-bottom:-12px;
  }
}

/* Mobile landscape: maximize world canvas */
@media (max-width:900px) and (orientation:landscape){
  .social-zone-app{
    grid-template-rows:44px minmax(0,1fr) 62px;
  }

  .social-zone-topbar{
    min-height:44px;
    padding-top:max(3px,var(--zone-safe-top));
    padding-bottom:3px;
  }

  .social-zone-logo{
    width:30px;
    height:30px;
    font-size:16px;
  }

  .social-zone-brand strong{
    font-size:8px;
  }

  .mobile-zone-online{
    height:30px;
  }

  .social-zone-topbar .small-btn{
    height:30px;
    min-height:30px;
  }

  .social-zone-controls{
    min-height:62px;
    grid-template-columns:54px minmax(0,1fr) 54px;
    padding-top:4px;
    padding-bottom:max(4px,var(--zone-safe-bottom));
  }

  .move-button{
    width:54px;
    height:50px;
    min-height:50px;
  }

  .zone-chat-form{
    height:50px;
  }

  .player-profile-card{
    left:auto;
    right:7px;
    bottom:7px;
    width:250px;
    max-height:calc(100% - 14px);
  }

  .gender-card{
    max-width:560px;
  }

  .gender-options button{
    min-height:120px;
  }

  .gender-preview{
    transform:scale(.68);
    margin-top:-15px;
    margin-bottom:-24px;
  }
}

/* Very small screens */
@media (max-width:380px){
  .social-zone-controls{
    grid-template-columns:52px minmax(0,1fr) 52px;
    gap:4px;
    padding-left:4px;
    padding-right:4px;
  }

  .move-button{
    width:52px;
  }

  .zone-chat-form{
    grid-template-columns:minmax(0,1fr) 52px;
    gap:4px;
  }

  .zone-chat-form input{
    padding:0 7px;
  }

  .zone-chat-form button{
    min-width:52px;
    font-size:10px;
  }

  .mobile-zone-online{
    padding:0 6px;
  }
}

/* Prefer reduced motion */
@media (prefers-reduced-motion:reduce){
  .move-button,
  .zone-chat-form button{
    transition:none!important;
  }
}


/* ==================================================================
   V3.7 GLOBAL CHAT — REGISTERED USERS + GM
   ================================================================== */
.portal-head-actions{
  display:flex;
  gap:8px;
  align-items:center;
}
.global-chat-entry,
.gm-chat-entry{
  background:linear-gradient(180deg,#2f7e9a,#235a77);
  color:#fff!important;
  border:1px solid #235a77!important;
}
.zone-global-chat-btn{
  background:#315f78!important;
  color:#fff!important;
  border-color:#497a92!important;
}

.global-chat-page{
  margin:0;
  width:100vw;
  height:100vh;
  height:100dvh;
  overflow:hidden;
  background:#e9eef2;
  color:#173449;
}
.global-chat-gate{
  position:fixed;
  inset:0;
  display:grid;
  place-items:center;
  background:radial-gradient(circle at 50% 20%,#315d78,#102a3c 70%);
}
.global-chat-gate-card{
  width:min(440px,calc(100% - 40px));
  padding:40px;
  text-align:center;
  border-radius:20px;
  background:#fff;
  box-shadow:0 30px 90px rgba(0,0,0,.28);
}
.global-chat-gate-icon{font-size:52px}
.global-chat-gate-card h1{margin:8px 0}
.global-chat-gate-card p{color:#758797}

.global-chat-app{
  width:100vw;
  height:100vh;
  height:100dvh;
  display:grid;
  grid-template-rows:68px minmax(0,1fr);
  background:#edf2f5;
}
.global-chat-topbar{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto auto;
  align-items:center;
  gap:18px;
  padding:
    max(8px,env(safe-area-inset-top,0px))
    max(16px,env(safe-area-inset-right,0px))
    8px
    max(16px,env(safe-area-inset-left,0px));
  background:#102c40;
  color:#fff;
  border-bottom:1px solid rgba(255,255,255,.12);
}
.global-chat-title,
.global-chat-self,
.global-chat-top-actions{
  display:flex;
  align-items:center;
  gap:10px;
}
.global-chat-logo{
  width:42px;
  height:42px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:#1f5574;
  font-size:22px;
}
.global-chat-title strong,
.global-chat-title small,
.global-chat-self strong,
.global-chat-self small{
  display:block;
}
.global-chat-title strong{font-size:14px}
.global-chat-title small{font-size:9px;color:#aac3d3;margin-top:2px}
.global-chat-self{
  padding:7px 10px;
  border-radius:10px;
  background:rgba(255,255,255,.06);
}
.global-chat-self strong{font-size:12px}
.global-chat-self small{font-size:8px;color:#a9c4d5;margin-top:2px}
.chat-self-badge{
  min-width:43px;
  height:30px;
  border-radius:8px;
  display:grid;
  place-items:center;
  padding:0 7px;
  font-size:8px;
  font-weight:1000;
}
.chat-self-badge.student{background:#dbeafb;color:#24557a}
.chat-self-badge.gm{background:#f3c546;color:#4b3300}

.global-chat-layout{
  display:grid;
  grid-template-columns:290px minmax(0,1fr);
  gap:10px;
  padding:10px;
  min-height:0;
}
.global-chat-members,
.global-chat-main{
  min-height:0;
  border:1px solid #d5e0e6;
  border-radius:13px;
  background:#fff;
  overflow:hidden;
}
.global-chat-members{
  display:grid;
  grid-template-rows:auto minmax(0,1fr) auto;
}
.global-chat-panel-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:13px;
  border-bottom:1px solid #e7ecef;
}
.global-chat-panel-head span,
.global-chat-panel-head strong{display:block}
.global-chat-panel-head span{font-size:8px;color:#7b8e9c}
.global-chat-panel-head strong{font-size:12px;margin-top:2px}
.global-chat-panel-head b{
  min-width:31px;
  height:31px;
  display:grid;
  place-items:center;
  border-radius:9px;
  background:#edf5f9;
  color:#24557a;
}
.global-chat-member-list{
  overflow:auto;
  padding:8px;
}
.global-chat-member{
  display:grid;
  grid-template-columns:39px minmax(0,1fr) 9px;
  gap:8px;
  align-items:center;
  padding:8px;
  border-radius:9px;
}
.global-chat-member:hover{background:#f4f8fa}
.global-chat-member.me{background:#eaf4fa}
.global-chat-member.gm{background:#fff8df}
.global-chat-member-avatar{
  width:37px;
  height:37px;
  border-radius:10px;
  display:grid;
  place-items:center;
  background:#315e7a;
  color:#fff;
  font-size:10px;
  font-weight:1000;
}
.global-chat-member.gm .global-chat-member-avatar{
  background:#d5a821;
  color:#fff9df;
}
.global-chat-member strong,
.global-chat-member small{display:block}
.global-chat-member strong{font-size:11px}
.global-chat-member small{font-size:8px;color:#80919e;margin-top:2px}
.global-chat-member em{
  font-size:6px;
  font-style:normal;
  padding:2px 4px;
  border-radius:4px;
  background:#24557a;
  color:#fff;
}
.global-chat-rule-card{
  margin:8px;
  padding:10px;
  border-radius:10px;
  background:#f7f4ed;
  border:1px solid #e3d8c6;
}
.global-chat-rule-card strong{font-size:10px}
.global-chat-rule-card p{font-size:8px;color:#766b5d;margin:5px 0 0}

.global-chat-main{
  display:grid;
  grid-template-rows:minmax(0,1fr) auto;
}
.global-chat-messages{
  min-height:0;
  overflow:auto;
  padding:16px;
  scroll-behavior:smooth;
  background:
    linear-gradient(rgba(250,252,253,.94),rgba(250,252,253,.94)),
    radial-gradient(circle at 1px 1px,#d6e1e7 1px,transparent 0);
  background-size:auto,22px 22px;
}
.global-chat-empty{
  height:100%;
  min-height:200px;
  display:grid;
  place-items:center;
  color:#8798a5;
  font-size:11px;
}
.global-chat-empty.error{color:#a74d4d}

.global-message{
  position:relative;
  display:grid;
  grid-template-columns:38px minmax(0,680px) auto;
  gap:8px;
  align-items:end;
  margin:10px 0;
}
.global-message.mine{
  grid-template-columns:auto minmax(0,680px) 38px;
  justify-content:end;
}
.global-message.mine .global-message-avatar{
  grid-column:3;
  grid-row:1;
}
.global-message.mine .global-message-body{
  grid-column:2;
  grid-row:1;
}
.global-message.mine .global-message-delete{
  grid-column:1;
  grid-row:1;
}
.global-message-avatar{
  width:36px;
  height:36px;
  border-radius:10px;
  display:grid;
  place-items:center;
  background:#315e7a;
  color:#fff;
  font-size:9px;
  font-weight:1000;
}
.global-message.gm .global-message-avatar{
  background:#d1a11f;
}
.global-message-body{
  min-width:0;
  padding:9px 11px;
  border:1px solid #dce4e9;
  border-radius:12px 12px 12px 3px;
  background:#fff;
  box-shadow:0 2px 6px rgba(26,52,68,.05);
}
.global-message.mine .global-message-body{
  background:#e9f4fb;
  border-color:#c5dce9;
  border-radius:12px 12px 3px 12px;
}
.global-message.gm .global-message-body{
  background:#fff8dc;
  border-color:#ecd991;
}
.global-message-meta{
  display:flex;
  align-items:center;
  gap:6px;
  margin-bottom:4px;
}
.global-message-meta strong{
  font-size:10px;
  color:#21465f;
}
.global-message-meta time{
  margin-left:auto;
  color:#91a0aa;
  font-size:7px;
}
.gm-label{
  padding:2px 5px;
  border-radius:999px;
  background:#d4a51e;
  color:#fff;
  font-size:6px;
  font-weight:1000;
}
.global-message-text{
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  line-height:1.55;
  font-size:13px;
  color:#263f50;
}
.global-message-delete{
  width:25px;
  height:25px;
  border:0;
  border-radius:7px;
  background:#edf0f2;
  color:#86939d;
  cursor:pointer;
}
.global-message-delete:hover{background:#f7dddd;color:#9f3f3f}

.global-chat-compose{
  display:grid;
  grid-template-columns:92px minmax(0,1fr) 92px;
  gap:8px;
  align-items:stretch;
  padding:10px;
  background:#102c40;
  border-top:1px solid rgba(255,255,255,.08);
}
.global-chat-compose-meta{
  padding:7px 9px;
  border-radius:10px;
  background:rgba(255,255,255,.06);
  color:#fff;
}
.global-chat-compose-meta span,
.global-chat-compose-meta strong{display:block}
.global-chat-compose-meta span{font-size:7px;color:#9cb6c7}
.global-chat-compose-meta strong{font-size:11px;margin-top:3px;overflow:hidden;text-overflow:ellipsis}
.global-chat-compose textarea{
  resize:none;
  min-height:58px;
  max-height:110px;
  border:0;
  outline:0;
  border-radius:10px;
  padding:11px 13px;
  font:inherit;
  font-size:14px;
}
.global-chat-compose button{
  border:0;
  border-radius:10px;
  background:linear-gradient(180deg,#55a96b,#347d4a);
  color:#fff;
  font-weight:1000;
  cursor:pointer;
}

@media(max-width:900px){
  .portal-head-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}
  .global-chat-app{grid-template-rows:58px minmax(0,1fr)}
  .global-chat-topbar{
    grid-template-columns:minmax(0,1fr) auto;
    gap:8px;
    padding:6px max(8px,env(safe-area-inset-right,0px)) 6px max(8px,env(safe-area-inset-left,0px));
  }
  .global-chat-self{display:none}
  .global-chat-title small{display:none}
  .global-chat-layout{
    grid-template-columns:220px minmax(0,1fr);
    padding:6px;
    gap:6px;
  }
  .global-chat-compose{grid-template-columns:minmax(0,1fr) 72px}
  .global-chat-compose-meta{display:none}
}
@media(max-width:650px){
  .global-chat-page{
    position:fixed;
    inset:0;
  }
  .global-chat-app{
    height:100dvh;
    grid-template-rows:52px minmax(0,1fr);
  }
  .global-chat-logo{width:34px;height:34px;font-size:17px}
  .global-chat-title strong{font-size:10px}
  .global-chat-top-actions .small-btn{min-height:34px;height:34px;padding:0 7px;font-size:8px}
  .global-chat-layout{
    grid-template-columns:1fr;
    grid-template-rows:minmax(0,1fr);
    padding:4px;
  }
  .global-chat-members{display:none}
  .global-chat-main{border-radius:10px}
  .global-chat-messages{padding:8px}
  .global-message{
    grid-template-columns:32px minmax(0,1fr) auto;
    gap:5px;
    margin:7px 0;
  }
  .global-message.mine{
    grid-template-columns:auto minmax(0,1fr) 32px;
  }
  .global-message-avatar{width:31px;height:31px;border-radius:9px;font-size:8px}
  .global-message-body{padding:8px 9px}
  .global-message-text{font-size:12px}
  .global-chat-compose{
    grid-template-columns:minmax(0,1fr) 62px;
    gap:5px;
    padding:
      6px max(6px,env(safe-area-inset-right,0px))
      max(6px,env(safe-area-inset-bottom,0px))
      max(6px,env(safe-area-inset-left,0px));
  }
  .global-chat-compose textarea{
    min-height:52px;
    font-size:16px;
    padding:9px;
  }
  .global-chat-compose button{font-size:11px}
}

/* ==================================================================
   V3.8 CHARACTER PROFILE / WARDROBE / PUBLIC CHARACTER VIEW
   ================================================================== */
.character-profile-entry{
  background:linear-gradient(180deg,#7659ad,#554083)!important;
  color:#fff!important;border-color:#554083!important
}

.character-modal{
  position:fixed;inset:0;z-index:30000;display:grid;place-items:center;
  padding:24px;background:rgba(4,14,23,.72);backdrop-filter:blur(8px)
}
.character-modal.hidden{display:none!important}
.character-modal-card{
  position:relative;width:min(1060px,calc(100vw - 48px));max-height:calc(100vh - 48px);
  overflow:auto;padding:26px;background:#f8f5ec;border:3px solid #82643c;border-radius:20px;
  box-shadow:0 30px 100px rgba(0,0,0,.38)
}
.character-modal-close{
  position:absolute;right:13px;top:13px;width:40px;height:40px;border:0;border-radius:10px;
  background:#e9dfcd;color:#5e4b33;cursor:pointer;z-index:20
}
.character-setup-card{width:min(720px,calc(100vw - 48px));text-align:center}
.character-setup-card h2{font-size:28px;margin:8px 0}.character-setup-card>p{color:#756956;line-height:1.6}
.character-gender-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
.character-gender-option{border:2px solid #d2c3a7;border-radius:16px;background:#fffdf6;padding:18px;cursor:pointer}
.character-gender-option:hover{border-color:#5e83a2;background:#f4f9fc}
.character-gender-option strong,.character-gender-option small{display:block}
.character-gender-option strong{font-size:18px;margin-top:8px}.character-gender-option small{font-size:10px;color:#81715e;margin-top:3px}

.character-profile-layout{display:grid;grid-template-columns:390px minmax(0,1fr);gap:18px}
.character-display-panel,.character-inventory-panel{border:1px solid #d9cfbd;border-radius:15px;background:#fffdf8;padding:18px}
.character-display-panel h2{margin:5px 0 12px}
.character-stage,.chat-character-stage{
  position:relative;display:grid;place-items:center;overflow:hidden;
  background:radial-gradient(circle at 50% 40%,rgba(255,238,183,.9),transparent 38%),linear-gradient(180deg,#d7e9ef 0 58%,#c4d8ad 58% 100%);
  border:2px solid #cdbb95;border-radius:16px
}
.preview-stage{height:230px}.large-stage{height:410px}
.chat-character-stage{height:390px;margin-top:12px}
.character-stage::after,.chat-character-stage::after{content:"";position:absolute;left:0;right:0;bottom:23%;height:2px;background:rgba(75,99,85,.16)}

.game-character{position:relative;width:155px;height:260px;z-index:2;transform-origin:center bottom}
.preview-stage .game-character{transform:scale(.72)}
.char-head{position:absolute;left:48px;top:42px;width:60px;height:64px;border-radius:44% 44% 48% 48%;background:#efc6a0;z-index:5}
.char-hair{position:absolute;left:43px;top:32px;width:70px;height:47px;background:#2c211d;border-radius:48% 48% 32% 32%;z-index:7}
.game-character.male .char-hair::before,.game-character.male .char-hair::after{content:"";position:absolute;background:#2c211d}
.game-character.male .char-hair::before{left:-5px;top:20px;width:15px;height:25px;border-radius:8px}
.game-character.male .char-hair::after{right:-5px;top:17px;width:14px;height:28px;border-radius:8px}
.game-character.female .char-hair{height:90px;left:39px;width:78px;border-radius:45% 45% 28% 28%}
.game-character.female .char-hair::after{content:"";position:absolute;right:-10px;top:32px;width:24px;height:58px;border-radius:50%;background:#2c211d}
.char-body{position:absolute;left:42px;top:103px;width:72px;height:78px;border-radius:18px 18px 12px 12px;background:#f5f1e9;z-index:4;border-bottom:10px solid #315b82}
.char-arm{position:absolute;top:112px;width:18px;height:68px;background:#eabf99;border-radius:12px;z-index:3}
.char-arm.left{left:25px;transform:rotate(5deg)}.char-arm.right{right:24px;transform:rotate(-5deg)}
.char-shorts{position:absolute;left:42px;top:174px;width:72px;height:38px;background:#315b82;border-radius:7px 7px 12px 12px;z-index:4}
.char-leg{position:absolute;top:205px;width:22px;height:36px;background:#e8bd98;z-index:3}
.char-leg.left{left:52px}.char-leg.right{right:51px}
.char-shoe{position:absolute;top:236px;width:30px;height:16px;background:#202a35;border-radius:10px 10px 5px 5px;z-index:4}
.char-shoe.left{left:44px}.char-shoe.right{right:43px}

.char-aura,.char-back-item,.char-face-item,.char-top-item,.char-bottom-item,.char-hand-item,.char-head-item,.char-pet-item{position:absolute;pointer-events:none}
.char-aura{inset:0;z-index:0}.char-back-item{z-index:1}.char-face-item{z-index:8}.char-top-item{z-index:6}
.char-bottom-item{z-index:6}.char-hand-item{z-index:9}.char-head-item{z-index:10}.char-pet-item{z-index:11}

.char-head-item[data-visual="cap"]{left:43px;top:22px;width:72px;height:28px;background:#316ca0;border-radius:30px 30px 8px 8px}
.char-head-item[data-visual="cap"]::after{content:"";position:absolute;right:-20px;bottom:0;width:30px;height:8px;background:#316ca0;border-radius:8px}
.char-face-item[data-visual="glasses"]{left:48px;top:67px;width:60px;height:18px;border-top:4px solid #26384a}
.char-face-item[data-visual="glasses"]::before,.char-face-item[data-visual="glasses"]::after{content:"";position:absolute;top:-8px;width:22px;height:17px;border:3px solid #26384a;border-radius:50%}
.char-face-item[data-visual="glasses"]::before{left:0}.char-face-item[data-visual="glasses"]::after{right:0}
.char-top-item[data-visual="shirt_blue"]{left:42px;top:103px;width:72px;height:78px;border-radius:18px;background:#3381b8}
.char-top-item[data-visual="thai_sash"]{left:61px;top:102px;width:18px;height:86px;background:linear-gradient(#d34e49,#f0c94e);transform:rotate(-18deg);border-radius:5px}
.char-top-item[data-visual="cyber_jacket"]{left:37px;top:100px;width:82px;height:86px;border-radius:16px;background:#142d42;border:3px solid #29d8e4;box-shadow:0 0 14px #29d8e4}
.char-head-item[data-visual="neon_headset"]{left:35px;top:41px;width:86px;height:58px;border:8px solid #292548;border-bottom:0;border-radius:48px 48px 0 0;box-shadow:0 0 10px #d846e8}
.char-head-item[data-visual="neon_headset"]::before,.char-head-item[data-visual="neon_headset"]::after{content:"";position:absolute;top:28px;width:16px;height:30px;background:#d846e8;border-radius:7px}
.char-head-item[data-visual="neon_headset"]::before{left:-10px}.char-head-item[data-visual="neon_headset"]::after{right:-10px}
.char-hand-item[data-visual="tablet"]{right:8px;top:138px;width:38px;height:52px;border-radius:5px;background:#132333;border:3px solid #42d6ee;box-shadow:0 0 12px #42d6ee}
.char-head-item[data-visual="gold_crown"]{left:48px;top:5px;width:62px;height:40px;background:linear-gradient(#ffd95a,#c99414);clip-path:polygon(0 100%,0 35%,25% 68%,43% 0,62% 68%,100% 28%,100% 100%);filter:drop-shadow(0 0 7px #ffd85e)}
.char-back-item[data-visual="backpack"]{left:28px;top:110px;width:90px;height:86px;border-radius:22px;background:#315f89;border:6px solid #203f5d}
.char-back-item[data-visual="royal_cape"]{left:31px;top:104px;width:94px;height:125px;background:linear-gradient(#7b245c,#461838);clip-path:polygon(12% 0,88% 0,100% 100%,50% 87%,0 100%);border-top:8px solid #f0c64d}
.char-back-item[data-visual="dragon_wings"]{left:-58px;top:75px;width:270px;height:150px}
.char-back-item[data-visual="dragon_wings"]::before,.char-back-item[data-visual="dragon_wings"]::after{content:"";position:absolute;top:0;width:125px;height:140px;background:linear-gradient(135deg,#512a8d,#e33c6f 55%,#f2943f);clip-path:polygon(100% 45%,64% 0,58% 35%,15% 12%,40% 55%,0 74%,52% 75%,63% 100%);filter:drop-shadow(0 0 12px rgba(231,73,115,.75))}
.char-back-item[data-visual="dragon_wings"]::before{left:0;transform:scaleX(-1)}.char-back-item[data-visual="dragon_wings"]::after{right:0}
.char-aura[data-visual="gold_aura"]{border:8px solid rgba(255,211,62,.62);border-radius:50%;box-shadow:0 0 25px #ffd84d,inset 0 0 20px #ffd84d;animation:characterAura 2s infinite alternate}
.char-aura[data-visual="master_halo"]::before{content:"";position:absolute;left:19px;top:8px;width:118px;height:38px;border:8px solid #65d9ff;border-radius:50%;box-shadow:0 0 20px #65d9ff;animation:haloPulse 1.4s infinite alternate}
.char-aura[data-visual="throne"]{left:-55px;right:-55px;top:60px;bottom:-15px;border-radius:80px 80px 20px 20px;background:linear-gradient(135deg,#6b234f,#2d164b);border:8px solid #e8bd42;z-index:-1;box-shadow:0 0 28px rgba(232,189,66,.65)}
.char-pet-item[data-visual="phoenix_pet"]{right:-75px;top:100px;width:60px;height:70px;background:#f04e2f;clip-path:polygon(50% 0,65% 33%,100% 22%,77% 55%,95% 88%,58% 72%,50% 100%,42% 72%,5% 88%,23% 55%,0 22%,35% 33%);filter:drop-shadow(0 0 13px #ff9c35);animation:petFloat 1.5s ease-in-out infinite alternate}
.char-shoe[data-equipped="shoe_white"]{background:#fff;border:1px solid #b7c1ca}

@keyframes characterAura{from{transform:scale(.94);opacity:.65}to{transform:scale(1.05);opacity:1}}
@keyframes haloPulse{from{transform:scaleX(.9);opacity:.65}to{transform:scaleX(1.1);opacity:1}}
@keyframes petFloat{from{transform:translateY(-4px)}to{transform:translateY(8px)}}

.character-profile-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}
.character-profile-stats>div{padding:10px;border:1px solid #ded5c6;border-radius:10px;background:#f8f4eb;text-align:center}
.character-profile-stats span,.character-profile-stats strong{display:block}.character-profile-stats span{font-size:8px;color:#81715e}.character-profile-stats strong{font-size:15px;margin-top:3px}
.character-inventory-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:12px}
.character-inventory-head h3{margin:4px 0 0}.character-inventory-head small{color:#837460}
.character-inventory-list{display:grid;gap:8px;max-height:570px;overflow:auto;padding-right:3px}
.wardrobe-item{display:grid;grid-template-columns:54px minmax(0,1fr) 90px;gap:10px;align-items:center;padding:10px;border:1px solid #ddd4c6;border-radius:11px;background:#fff}
.wardrobe-item.equipped{box-shadow:inset 0 0 0 2px #4d9c70;background:#eff9f3}
.wardrobe-icon{font-size:28px;text-align:center}
.wardrobe-info span,.wardrobe-info strong,.wardrobe-info small{display:block}.wardrobe-info span{font-size:7px;font-weight:900;letter-spacing:.08em}
.wardrobe-info strong{font-size:11px;margin:2px 0}.wardrobe-info small{font-size:8px;color:#806f5c}
.wardrobe-action{text-align:right}.wardrobe-action>small{display:block;font-size:7px;color:#8c7b67;margin-bottom:5px}
.wardrobe-action .btn{min-height:34px;padding:0 9px;font-size:9px}

.rarity-common{--rarity:#7a8a92}.rarity-rare{--rarity:#397fc0}.rarity-epic{--rarity:#8e4dcc}.rarity-legendary{--rarity:#d08b17}.rarity-mythic{--rarity:#d63e6d}
.reward-card[class*="rarity-"],.wardrobe-item[class*="rarity-"]{border-top:4px solid var(--rarity)}
.reward-rarity{font-size:8px;font-weight:1000;letter-spacing:.09em;color:var(--rarity)}
.reward-slot{font-size:8px;color:#867867;margin:7px 0}
.reward-card.rarity-mythic{background:linear-gradient(145deg,#fff,#fff2f8);box-shadow:0 12px 30px rgba(214,62,109,.13)}
.reward-card.rarity-mythic .reward-icon{font-size:40px;filter:drop-shadow(0 4px 9px rgba(214,62,109,.28))}

/* Public character modal from chat */
.global-chat-member.clickable{cursor:pointer}
.global-chat-member.clickable:hover{outline:1px solid #7aa1b8}
.chat-character-modal{position:fixed;inset:0;z-index:31000;display:grid;place-items:center;background:rgba(4,14,23,.72);backdrop-filter:blur(7px);padding:16px}
.chat-character-modal.hidden{display:none!important}
.chat-character-card{position:relative;width:360px;max-width:100%;padding:20px;border-radius:18px;background:#fff9ec;border:3px solid #876738;text-align:center;box-shadow:0 25px 70px rgba(0,0,0,.35)}
.chat-character-card>button{position:absolute;right:9px;top:9px;width:36px;height:36px;border:0;border-radius:9px;background:#eadfc9;cursor:pointer}
.chat-character-card h2{margin:6px 0}.chat-character-meta{display:flex;justify-content:center;gap:8px;margin-top:10px;font-size:10px}.chat-character-meta strong{color:#5c4388}

@media(max-width:900px){
  .character-profile-layout{grid-template-columns:1fr}
  .large-stage{height:340px}
}
@media(max-width:650px){
  .character-modal{padding:7px}
  .character-modal-card{width:100%;max-height:calc(100dvh - 14px);padding:15px;border-width:2px}
  .character-gender-grid{gap:7px}.preview-stage{height:185px}
  .large-stage{height:320px}
  .wardrobe-item{grid-template-columns:45px minmax(0,1fr) 72px;gap:5px;padding:7px}
  .wardrobe-info small{display:none}
  .portal-head-actions{grid-template-columns:1fr 1fr}
  .portal-head-actions #logoutUserButton{grid-column:1/-1}
}


/* ==================================================================
   V3.9 — 2D ZONE + IN-ZONE TOKEN SHOP + GM MODERATION
   ================================================================== */
.zone-entry-main{
  background:linear-gradient(180deg,#315f7c,#21465f)!important;
  color:#fff!important;border-color:#21465f!important
}
.character-profile-actions{display:grid;gap:7px;margin-top:10px}

/* ---- 2D Zone ---- */
.zone-v39-page{
  margin:0;width:100vw;height:100vh;height:100dvh;overflow:hidden;
  background:#061725;color:#173449
}
.zone-v39-gate{
  position:fixed;inset:0;z-index:50000;display:grid;place-items:center;
  background:radial-gradient(circle at 50% 20%,#1b4965,#061521 70%)
}
.zone-v39-gate-card{
  width:min(520px,calc(100% - 36px));padding:38px;text-align:center;
  background:#fff9eb;border:4px solid #916b3c;border-radius:22px;
  box-shadow:0 30px 100px rgba(0,0,0,.42)
}
.zone-v39-gate[data-state="banned"] .zone-v39-gate-card{border-color:#a23e3e}
.zone-v39-gate[data-state="kicked"] .zone-v39-gate-card{border-color:#c9832d}
.zone-v39-gate-icon{font-size:56px}.zone-v39-gate-card h1{margin:10px 0 8px}.zone-v39-gate-card p{color:#746754;line-height:1.65}

.zone-v39-app{
  width:100vw;height:100vh;height:100dvh;
  display:grid;grid-template-rows:68px minmax(0,1fr) 86px;background:#071827
}
.zone-v39-topbar{
  display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;gap:14px;align-items:center;
  padding:7px 16px;background:linear-gradient(180deg,#0c2a40,#071c2c);
  color:#fff;border-bottom:1px solid rgba(255,255,255,.11)
}
.zone-v39-brand,.zone-v39-self,.zone-v39-actions{display:flex;align-items:center;gap:9px}
.zone-v39-logo{width:42px;height:42px;border-radius:12px;background:#16425e;display:grid;place-items:center;font-size:22px}
.zone-v39-brand strong,.zone-v39-brand small,.zone-v39-self strong,.zone-v39-self small,.zone-v39-wallet span,.zone-v39-wallet strong{display:block}
.zone-v39-brand strong{font-size:12px;letter-spacing:.06em}.zone-v39-brand small{font-size:8px;color:#9ebbcf;margin-top:2px}
.zone-v39-self{padding:6px 10px;background:rgba(255,255,255,.06);border-radius:10px}
.zone-v39-self strong{font-size:11px}.zone-v39-self small{font-size:8px;color:#a8c1d2;margin-top:2px}
.zone-v39-wallet{min-width:88px;text-align:right}.zone-v39-wallet span{font-size:7px;color:#e7c96e}.zone-v39-wallet strong{font-size:16px;color:#ffda63;margin-top:2px}
.zone-v39-actions .btn{min-height:38px;padding:0 11px;font-size:9px}
.zone-shop-button{background:linear-gradient(180deg,#c28d26,#8a5c17)!important;color:#fff!important;border-color:#d7a647!important}

.zone-v39-world{position:relative;min-height:0;overflow:hidden;background:#122f41}
#zoneCanvas{display:block;width:100%;height:100%;cursor:pointer}
.zone-v39-help{
  position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;
  padding:7px 10px;border-radius:9px;background:rgba(5,18,28,.8);color:#d7e8f2;
  font-size:8px;border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(7px)
}
.zone-v39-help b{color:#ffd86c}

.zone-v39-player-card{
  position:absolute;right:14px;top:14px;width:270px;padding:16px;
  background:rgba(255,249,233,.97);border:3px solid #896638;border-radius:15px;
  box-shadow:0 20px 60px rgba(0,0,0,.28)
}
.zone-v39-player-card>button{position:absolute;right:8px;top:8px;width:32px;height:32px;border:0;border-radius:8px;background:#eadfc9;cursor:pointer}
.zone-v39-player-card h3{margin:7px 0 3px}.zone-v39-player-card p{font-size:10px;color:#736551;margin:0 0 10px}
.zone-v39-player-card>span{font-size:8px;color:#81725e}
.zone-player-equipped-list{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px}
.zone-player-equipped-list>div{min-height:62px;padding:5px;display:grid;place-items:center;text-align:center;background:#fff;border:1px solid #dfd3bd;border-radius:8px}
.zone-player-equipped-list span{font-size:22px}.zone-player-equipped-list small{font-size:7px;color:#6f6251}.empty-mini{grid-column:1/-1;font-size:8px;color:#887966}

.zone-v39-controls{
  display:grid;grid-template-columns:92px minmax(0,760px) 92px;gap:10px;justify-content:center;align-items:center;
  padding:10px 16px max(10px,env(safe-area-inset-bottom,0px));
  background:linear-gradient(180deg,#102c40,#071b29);border-top:1px solid rgba(255,255,255,.12)
}
.zone-move-button{
  height:62px;border:1px solid rgba(255,255,255,.14);border-radius:16px;
  background:linear-gradient(180deg,#285e80,#173d59);color:#fff;font-size:30px;font-weight:900;
  cursor:pointer;touch-action:none;user-select:none
}
.zone-move-button:active{transform:translateY(2px)}
.zone-v39-chat-form{
  height:62px;display:grid;grid-template-columns:minmax(0,1fr) 88px;gap:7px;padding:7px;
  background:#f7f0e2;border:3px solid #8b6537;border-radius:16px
}
.zone-v39-chat-form input{min-width:0;border:0;outline:0;border-radius:9px;padding:0 13px;background:#fffaf0;font-size:15px}
.zone-v39-chat-form button{border:0;border-radius:9px;background:linear-gradient(#8bb53c,#527c24);color:#fff;font-weight:900;cursor:pointer}

/* ---- Zone modals ---- */
.zone-v39-modal{
  position:fixed;inset:0;z-index:40000;display:grid;place-items:center;padding:20px;
  background:rgba(3,13,21,.72);backdrop-filter:blur(7px)
}
.zone-v39-modal.hidden{display:none!important}
.zone-v39-modal-card{
  position:relative;width:min(1120px,calc(100vw - 40px));max-height:calc(100dvh - 40px);
  overflow:auto;padding:24px;background:#fff8e9;border:4px solid #8c6636;border-radius:20px;
  box-shadow:0 30px 100px rgba(0,0,0,.4)
}
.zone-v39-modal-close{position:absolute;right:12px;top:12px;width:40px;height:40px;border:0;border-radius:10px;background:#eadfc9;cursor:pointer;z-index:5}
.zone-shop-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:15px}
.zone-shop-head h2{margin:5px 0}.zone-shop-head p{margin:0;color:#776956;font-size:10px}
.zone-shop-wallet{min-width:150px;padding:11px;border-radius:11px;background:#5e4021;color:#fff;text-align:center}
.zone-shop-wallet span,.zone-shop-wallet strong{display:block}.zone-shop-wallet span{font-size:8px;color:#edcf91}.zone-shop-wallet strong{font-size:25px;color:#ffd86a;margin-top:4px}
.zone-shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.zone-shop-item{
  --rarity:#7a8a92;display:grid;grid-template-rows:auto auto auto minmax(36px,auto) auto auto;
  gap:5px;padding:12px;border:1px solid #ded2bd;border-top:5px solid var(--rarity);border-radius:13px;background:#fff;text-align:center
}
.zone-shop-item.rarity-common{--rarity:#7a8a92}.zone-shop-item.rarity-rare{--rarity:#397fc0}.zone-shop-item.rarity-epic{--rarity:#8e4dcc}
.zone-shop-item.rarity-legendary{--rarity:#d08b17}.zone-shop-item.rarity-mythic{--rarity:#d63e6d;background:linear-gradient(145deg,#fff,#fff1f7)}
.zone-shop-item.wearing{box-shadow:inset 0 0 0 3px #4c9b6c}
.zone-shop-rarity{font-size:7px;font-weight:1000;letter-spacing:.1em;color:var(--rarity)}
.zone-shop-icon{font-size:36px}.zone-shop-item>strong{font-size:11px}.zone-shop-item>small{font-size:8px;color:#776957;line-height:1.45}
.zone-shop-item>em{font-style:normal;font-size:10px;font-weight:900;color:#87611f}
.zone-shop-item .btn{min-height:36px;font-size:9px}
.zone-buy-btn{background:linear-gradient(#b98b2d,#795313)!important;color:#fff!important;border-color:#a77a22!important}
.zone-own-profile-card{width:min(520px,calc(100vw - 40px));text-align:center}
.zone-profile-preview{margin:10px auto;border:2px solid #c9b78f;border-radius:15px;overflow:hidden;background:#17394a}
#zoneProfileCanvas{display:block;width:100%;height:auto}

/* ---- Admin Zone moderation ---- */
.zone-admin-tab{color:#6b4d14!important}
.zone-admin-summary{display:flex;gap:8px}
.zone-admin-summary span{padding:8px 10px;border-radius:9px;background:#eef4f7;font-size:9px;color:#647785}
.zone-admin-summary b{font-size:16px;color:#244b75;margin-right:3px}
.zone-admin-help{padding:10px 12px;margin-bottom:12px;border:1px solid #e4d7bd;border-radius:10px;background:#fff8e7;color:#76654d;font-size:9px;line-height:1.65}
.zone-control-table{min-width:1320px}
.zone-row-online{background:#f1fbf5}.zone-row-banned{background:#fff0f0}
.zone-admin-status{display:inline-flex;padding:4px 7px;border-radius:999px;font-size:7px;font-weight:900}
.zone-admin-status.online{background:#dff5e8;color:#287348}.zone-admin-status.offline{background:#edf0f2;color:#77848d}.zone-admin-status.banned{background:#f8dede;color:#9b3030}
.zone-ban-reason{width:170px;min-height:35px!important;font-size:10px!important;padding:5px 7px!important}
.zone-ban-duration{display:flex;gap:4px}.zone-ban-duration input{width:60px;min-height:35px!important;font-size:10px!important;padding:5px!important}
.zone-ban-duration select{width:76px;min-height:35px;font-size:9px}
.zone-admin-actions{display:flex;gap:4px}.zone-admin-actions .btn{min-height:34px;padding:0 8px;font-size:8px}
.zone-kick-btn{background:#d18b2b!important;color:#fff!important;border-color:#c17b20!important}

@media(max-width:1050px){
  .zone-v39-topbar{grid-template-columns:minmax(0,1fr) auto auto;gap:7px}
  .zone-v39-self{display:none}
  .zone-shop-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:700px){
  .zone-v39-app{grid-template-rows:52px minmax(0,1fr) 74px}
  .zone-v39-topbar{grid-template-columns:minmax(0,1fr) auto auto;padding:5px 6px}
  .zone-v39-logo{width:34px;height:34px;font-size:18px}.zone-v39-brand strong{font-size:8px}.zone-v39-brand small{display:none}
  .zone-v39-wallet{min-width:55px}.zone-v39-wallet span{font-size:6px}.zone-v39-wallet strong{font-size:12px}
  .zone-v39-actions .btn{display:none}.zone-v39-actions #openZoneShop{display:inline-flex;min-height:34px;padding:0 7px}
  .zone-v39-help{display:none}
  .zone-v39-controls{grid-template-columns:56px minmax(0,1fr) 56px;gap:5px;padding:6px}
  .zone-move-button{height:56px;font-size:23px}
  .zone-v39-chat-form{height:56px;grid-template-columns:minmax(0,1fr) 55px;border-width:2px;padding:5px}
  .zone-v39-chat-form input{font-size:16px;padding:0 8px}.zone-v39-chat-form button{font-size:10px}
  .zone-v39-player-card{left:6px;right:6px;top:auto;bottom:6px;width:auto}
  .zone-v39-modal{padding:7px}.zone-v39-modal-card{width:100%;max-height:calc(100dvh - 14px);padding:15px;border-width:2px}
  .zone-shop-head{display:block}.zone-shop-wallet{margin-top:8px}
  .zone-shop-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
  .zone-shop-item{padding:8px}.zone-shop-icon{font-size:29px}
}
@media(max-width:400px){
  .zone-shop-grid{grid-template-columns:1fr 1fr}
  .zone-v39-controls{grid-template-columns:50px minmax(0,1fr) 50px}
  .zone-move-button{height:52px}
}


/* ==================================================================
   V4.0 STABLE 2D ZONE — DAY / NIGHT EVERY 3 HOURS
   ================================================================== */
.zone-v40-page{
  margin:0;width:100vw;height:100vh;height:100dvh;overflow:hidden;
  background:#061725;color:#173449
}

.zone-v40-gate{
  position:fixed;inset:0;z-index:50000;display:grid;place-items:center;
  background:radial-gradient(circle at 50% 20%,#1b4965,#061521 70%)
}
.zone-v40-gate-card{
  width:min(620px,calc(100% - 36px));padding:32px;
  background:#fff9eb;border:4px solid #916b3c;border-radius:22px;text-align:center;
  box-shadow:0 30px 100px rgba(0,0,0,.42)
}
.zone-v40-gate[data-state="banned"] .zone-v40-gate-card,
.zone-v40-gate[data-state="rules"] .zone-v40-gate-card{border-color:#ad4141}
.zone-v40-gate[data-state="kicked"] .zone-v40-gate-card{border-color:#c9832d}
.zone-v40-gate-icon{font-size:52px}
.zone-v40-gate-card h1{margin:8px 0}
.zone-v40-gate-card>p{color:#746754;line-height:1.6}

.zone-boot-steps{
  display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:17px 0;
}
.zone-boot-steps>div{
  min-width:0;padding:8px 5px;border:1px solid #dfd2bc;border-radius:9px;background:#fffdf6
}
.zone-boot-steps span{
  width:21px;height:21px;margin:auto auto 5px;border-radius:50%;
  display:grid;place-items:center;background:#e7e0d3;font-size:8px;font-weight:900
}
.zone-boot-steps strong,.zone-boot-steps em{display:block}
.zone-boot-steps strong{font-size:8px}.zone-boot-steps em{font-size:7px;color:#8c7c66;font-style:normal;margin-top:3px}
.zone-boot-steps>div[data-status="ok"]{background:#eff9f2;border-color:#a9d5b8}
.zone-boot-steps>div[data-status="ok"] span{background:#3a9960;color:#fff}
.zone-boot-steps>div[data-status="loading"] span{background:#397fac;color:#fff}
.zone-boot-steps>div[data-status="error"]{background:#fff0f0;border-color:#e2a2a2}
.zone-boot-steps>div[data-status="error"] span{background:#bf4545;color:#fff}
.zone-gate-error-help{
  margin:10px 0;padding:11px;border:1px solid #e1b6a6;border-radius:10px;
  background:#fff2ed;text-align:left;color:#714a3e;font-size:9px;line-height:1.6
}
.zone-gate-error-help strong{font-size:10px}.zone-gate-error-help p{margin:5px 0}
.zone-gate-error-help code{padding:2px 4px;border-radius:4px;background:#f2ddd4}

.zone-v40-app{
  width:100vw;height:100vh;height:100dvh;
  display:grid;grid-template-rows:68px minmax(0,1fr) 86px;background:#071827
}
.zone-v40-topbar{
  display:grid;grid-template-columns:minmax(0,1fr) auto auto auto auto;gap:12px;align-items:center;
  padding:7px 14px;background:linear-gradient(180deg,#0c2a40,#071c2c);
  color:#fff;border-bottom:1px solid rgba(255,255,255,.11)
}
.zone-v40-brand,.zone-v40-self,.zone-v40-actions{display:flex;align-items:center;gap:9px}
.zone-v40-logo{width:42px;height:42px;border-radius:12px;background:#16425e;display:grid;place-items:center;font-size:22px}
.zone-v40-brand strong,.zone-v40-brand small,.zone-v40-self strong,.zone-v40-self small,
.zone-v40-time span,.zone-v40-time strong,.zone-v40-wallet span,.zone-v40-wallet strong{display:block}
.zone-v40-brand strong{font-size:12px;letter-spacing:.05em}.zone-v40-brand small{font-size:8px;color:#9ebbcf;margin-top:2px}
.zone-v40-time{min-width:118px;padding:6px 9px;border-radius:9px;background:rgba(255,255,255,.06)}
.zone-v40-time span{font-size:10px;font-weight:900;color:#ffd46d}.zone-v40-time strong{font-size:7px;color:#a9c2d2;margin-top:2px}
.zone-v40-self{padding:6px 9px;background:rgba(255,255,255,.06);border-radius:9px}
.zone-v40-self strong{font-size:10px}.zone-v40-self small{font-size:7px;color:#a8c1d2}
.zone-v40-wallet{text-align:right}.zone-v40-wallet span{font-size:7px;color:#e7c96e}.zone-v40-wallet strong{font-size:15px;color:#ffda63}
.zone-v40-actions .btn{min-height:37px;padding:0 9px;font-size:8px}

.zone-v40-world{position:relative;min-height:0;overflow:hidden;background:#122f41;transition:background .4s ease}
#zoneCanvas{display:block;width:100%;height:100%;cursor:pointer}
.zone-v40-help{
  position:absolute;left:11px;top:11px;display:flex;gap:6px;align-items:center;
  padding:7px 9px;border-radius:9px;background:rgba(5,18,28,.8);color:#d7e8f2;
  font-size:8px;border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(7px)
}
.zone-v40-help b{color:#ffd86c}
.zone-connection-badge{
  position:absolute;right:11px;bottom:10px;display:flex;align-items:center;gap:6px;
  padding:6px 9px;border-radius:999px;background:rgba(6,27,38,.82);
  color:#cbe5d3;font-size:7px;letter-spacing:.05em
}
.zone-connection-badge[data-state="error"]{background:#6e2626;color:#fff}

.zone-v40-player-card{
  position:absolute;right:14px;top:14px;width:270px;padding:16px;
  background:rgba(255,249,233,.97);border:3px solid #896638;border-radius:15px;
  box-shadow:0 20px 60px rgba(0,0,0,.28)
}
.zone-v40-player-card>button{position:absolute;right:8px;top:8px;width:32px;height:32px;border:0;border-radius:8px;background:#eadfc9;cursor:pointer}

.zone-v40-controls{
  display:grid;grid-template-columns:92px minmax(0,760px) 92px;gap:10px;justify-content:center;align-items:center;
  padding:10px 16px max(10px,env(safe-area-inset-bottom,0px));
  background:linear-gradient(180deg,#102c40,#071b29);border-top:1px solid rgba(255,255,255,.12)
}
.zone-v40-chat-form{
  height:62px;display:grid;grid-template-columns:minmax(0,1fr) 88px;gap:7px;padding:7px;
  background:#f7f0e2;border:3px solid #8b6537;border-radius:16px
}
.zone-v40-chat-form input{min-width:0;border:0;outline:0;border-radius:9px;padding:0 13px;background:#fffaf0;font-size:15px}
.zone-v40-chat-form button{border:0;border-radius:9px;background:linear-gradient(#8bb53c,#527c24);color:#fff;font-weight:900;cursor:pointer}

.zone-v40-modal{
  position:fixed;inset:0;z-index:40000;display:grid;place-items:center;padding:20px;
  background:rgba(3,13,21,.72);backdrop-filter:blur(7px)
}
.zone-v40-modal.hidden{display:none!important}
.zone-v40-modal-card{
  position:relative;width:min(1120px,calc(100vw - 40px));max-height:calc(100dvh - 40px);
  overflow:auto;padding:24px;background:#fff8e9;border:4px solid #8c6636;border-radius:20px;
  box-shadow:0 30px 100px rgba(0,0,0,.4)
}
.zone-v40-modal-close{position:absolute;right:12px;top:12px;width:40px;height:40px;border:0;border-radius:10px;background:#eadfc9;cursor:pointer;z-index:5}

@media(max-width:1100px){
  .zone-v40-topbar{grid-template-columns:minmax(0,1fr) auto auto auto}
  .zone-v40-self{display:none}
}
@media(max-width:760px){
  .zone-v40-app{grid-template-rows:52px minmax(0,1fr) 74px}
  .zone-v40-topbar{grid-template-columns:minmax(0,1fr) auto auto;padding:5px 6px;gap:5px}
  .zone-v40-brand small,.zone-v40-time{display:none}
  .zone-v40-logo{width:33px;height:33px;font-size:17px}.zone-v40-brand strong{font-size:8px}
  .zone-v40-wallet{min-width:50px}.zone-v40-wallet strong{font-size:11px}
  .zone-v40-actions .btn{display:none}.zone-v40-actions #openZoneShop{display:inline-flex;min-height:34px;padding:0 7px}
  .zone-v40-help{display:none}
  .zone-v40-controls{grid-template-columns:56px minmax(0,1fr) 56px;gap:5px;padding:6px}
  .zone-v40-chat-form{height:56px;grid-template-columns:minmax(0,1fr) 55px;border-width:2px;padding:5px}
  .zone-v40-chat-form input{font-size:16px;padding:0 8px}.zone-v40-chat-form button{font-size:10px}
  .zone-boot-steps{grid-template-columns:1fr}.zone-boot-steps>div{display:grid;grid-template-columns:28px 1fr auto;align-items:center;text-align:left}
  .zone-boot-steps span{margin:0}.zone-boot-steps em{text-align:right}
  .zone-v40-player-card{left:6px;right:6px;top:auto;bottom:6px;width:auto}
  .zone-v40-modal{padding:7px}.zone-v40-modal-card{width:100%;max-height:calc(100dvh - 14px);padding:15px;border-width:2px}
}


/* ==================================================================
   V4.1 — GM EXCLUSIVE CHARACTER + 24H ZONE CHAT
   ================================================================== */
.zone-chat-history-button{background:linear-gradient(180deg,#6d4aa7,#4d337d)!important;color:#fff!important;border-color:#7553ad!important}
.gm-admin-panel,.gm-zone-entry{background:linear-gradient(180deg,#8b223d,#5d1328)!important;color:#ffe9a8!important;border-color:#d3a43d!important}
.zone-chat-history-card{width:min(900px,calc(100vw - 40px))}
.zone-chat-history-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-end;margin-bottom:12px}
.zone-chat-history-head h2{margin:5px 0}.zone-chat-history-head p{margin:0;color:#746753;font-size:9px}
.zone-chat-history-legend{display:flex;gap:6px}.zone-chat-history-legend span{padding:6px 8px;border-radius:999px;font-size:7px;font-weight:900}
.zone-chat-history-legend .user{background:#e8f0f5;color:#45677d}.zone-chat-history-legend .gm{background:#64172c;color:#ffe8a3;border:1px solid #d6a943}
.zone-chat-history-list{height:min(560px,65vh);overflow:auto;display:grid;gap:7px;padding:4px}
.zone-chat-log-row{display:grid;grid-template-columns:46px minmax(0,1fr);gap:9px;padding:10px;border:1px solid #ddd4c4;border-radius:11px;background:#fff}
.zone-chat-log-row.gm{background:linear-gradient(135deg,#fff6dc,#fff);border:2px solid #c99837;box-shadow:0 5px 18px rgba(142,89,25,.1)}
.zone-chat-log-avatar{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:#16394f;color:#fff;font-size:9px;font-weight:1000}
.zone-chat-log-row.gm .zone-chat-log-avatar{background:#6b1730;color:#ffe6a0;border:2px solid #d6a843}
.zone-chat-log-body>div{display:flex;gap:8px;align-items:center}.zone-chat-log-body strong{font-size:10px}.zone-chat-log-body time{margin-left:auto;font-size:7px;color:#897967}
.zone-chat-log-body p{margin:5px 0;font-size:12px;line-height:1.5;color:#253d4b}.zone-chat-log-row.gm p{color:#61182c;font-weight:700}.zone-chat-log-body small{font-size:7px;color:#8a7964}.zone-chat-empty{padding:40px;text-align:center;color:#897a68}
.gm-exclusive-mini{border-color:#d3a33e!important;background:linear-gradient(#fff6dc,#fff)!important}

.admin-zone-chat-summary{display:flex;gap:8px;margin-bottom:12px}.admin-zone-chat-summary span{padding:8px 11px;border-radius:9px;background:#edf3f6;font-size:8px}.admin-zone-chat-summary b{font-size:15px;color:#244c73;margin-right:3px}
.admin-zone-chat-list{display:grid;gap:7px;max-height:650px;overflow:auto;padding:3px}
.admin-zone-chat-message{display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px;border:1px solid #dce3e7;border-radius:10px;background:#fff}
.admin-zone-chat-message.gm{background:#fff7dc;border:2px solid #ca9b32}.admin-zone-chat-avatar{width:42px;height:42px;border-radius:10px;background:#153a51;color:#fff;display:grid;place-items:center;font-size:9px;font-weight:900}
.admin-zone-chat-message.gm .admin-zone-chat-avatar{background:#65162c;color:#ffe5a0;border:2px solid #d1a23c}.admin-zone-chat-meta{display:flex;flex-wrap:wrap;gap:7px;align-items:center}.admin-zone-chat-meta strong{font-size:10px}.admin-zone-chat-meta span,.admin-zone-chat-meta time{font-size:8px;color:#7a8992}.admin-zone-chat-meta time{margin-left:auto}.admin-zone-chat-content p{margin:5px 0;font-size:11px;line-height:1.5}.admin-zone-chat-message.gm .admin-zone-chat-content p{color:#64172d;font-weight:700}.admin-zone-chat-content small{font-size:7px;color:#897967}
.btn.warning{background:#c7892e!important;color:#fff!important;border-color:#ad721f!important}

@media(max-width:900px){.zone-chat-history-head{display:block}.zone-chat-history-legend{margin-top:8px}.admin-zone-chat-message{grid-template-columns:42px minmax(0,1fr)}.admin-zone-chat-message>.mini-delete{grid-column:1/-1}.admin-zone-chat-meta time{margin-left:0}}


/* ===== V4.2 — MOBILE/TABLET ZONE ONLY + GM LABEL ===== */
.mobile-zone-only-card{border:1px solid #d2deea;background:linear-gradient(180deg,#ffffff 0%,#f3f8fc 100%)}
.mobile-zone-only-card h3{margin:6px 0 10px;font-size:24px;color:#193a5d}
.mobile-zone-only-card p{margin:0 0 14px;color:#536171;line-height:1.75}
.mobile-zone-only-card small{display:block;margin-top:12px;color:#6a7685}
.mobile-zone-only-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:#e8f1fb;color:#1f4f7b;font-size:11px;font-weight:800;letter-spacing:.08em}
.mobile-zone-only-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.mobile-zone-only-actions .btn{min-height:48px;padding:0 22px;font-size:16px}
.zone-only-device #userPortal>.portal-stat-grid,
.zone-only-device #userPortal>#languageSection,
.zone-only-device #userPortal>#learningSection,
.zone-only-device #userPortal>#modeSection,
.zone-only-device #userPortal>#classicConfig,
.zone-only-device #userPortal>#officialConfig,
.zone-only-device #userPortal>#pvpConfig,
.zone-only-device #userPortal>.social-hub-grid,
.zone-only-device #userPortal>.zone-entry-card,
.zone-only-device #userPortal>.character-placeholder,
.zone-only-device #userPortal>section.card:not(#mobileZoneOnlyNotice){display:none!important}
.zone-only-device #openCharacterProfileButton{display:none!important}
.zone-only-device .user-portal-head{align-items:flex-start}
.zone-only-device .user-portal-head h2{font-size:28px}
.zone-only-device .portal-head-actions{display:flex;flex-wrap:wrap;gap:10px}
.zone-only-device .zone-entry-main{min-height:48px;padding:0 20px}
@media(max-width:900px){.mobile-zone-only-card h3{font-size:21px}}
@media(max-width:650px){.mobile-zone-only-card{padding:18px}.mobile-zone-only-card h3{font-size:20px}.mobile-zone-only-actions .btn{width:100%;justify-content:center}}


/* ===== V4.3 STABILITY / COMPLETE PVP / ADMIN ARCHIVE ===== */
#pvpGameScreen{max-width:1180px;margin:18px auto;min-height:calc(100vh - 36px)}
#pvpTypingStage.wrong-flash{border-color:#cb3b3b;box-shadow:0 0 0 4px rgba(203,59,59,.14)}
#pvpTypingStage.wrong-shake{animation:shake .2s}
#pvpTypingDisplay .pending{color:#9ba5ae}
#pvpTypingDisplay .correct{color:#237a54;background:rgba(35,122,84,.07)}
#pvpTypingDisplay .current{border-left:2px solid var(--blue);background:#eef5fc;animation:blink .9s infinite}
.admin-toast{position:fixed;right:18px;bottom:18px;z-index:60000;width:min(360px,calc(100vw - 36px));padding:14px 16px;border-radius:12px;background:#153f61;color:#fff;box-shadow:0 18px 60px rgba(0,0,0,.22);display:grid;gap:4px}
.admin-toast strong{font-size:13px}.admin-toast span{font-size:11px;color:#d8e8f4}.admin-toast.error{background:#8d3030}.admin-toast.hidden{display:none!important}
.admin-zone-chat-message.expired{opacity:.72;background:#f5f6f7;border-style:dashed}
.admin-zone-chat-message.expired small{color:#8a6a37;font-weight:700}
@media(max-width:900px){#pvpGameScreen{margin:0;min-height:100dvh;border-radius:0}.pvp-progress-board>div{grid-template-columns:100px 1fr 48px}}

```

---

## app.js

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, where, orderBy, limit, onSnapshot, runTransaction
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js?v=4.3.0";
import { LANGUAGES, LESSONS, DIFFICULTIES } from "./lessons.js?v=4.3.0";
import { REWARD_ITEMS, RARITY_META } from "./reward-data.js?v=4.3.0";
import { DEFAULT_CHARACTER, DEFAULT_ZONE_STATE } from "./character-system.js?v=4.3.0";
import { OFFICIAL_STAGES, OFFICIAL_TOTAL_SCORE } from "./official-data.js?v=4.3.0";
import { RANKING_CONFIG, seasonIdFromDate, seasonRange, calculateRankMetrics } from "./ranking-system.js?v=4.3.0";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const $ = id => document.getElementById(id);

const state = {
  uid:null, player:null, language:null, lesson:null, difficulty:null, gameMode:"classic",
  attemptId:null, started:false, finished:false, startTime:0, timer:null,
  mistakes:0, keystrokes:0, correctText:"",
  historyUnsub:null,
  roomUnsub:null, roomCode:null, roomData:null,
  officialProgress:{}, officialSelected:null, officialUnsub:null,
  presenceUnsub:null, leaderboardUnsub:null, presenceTimer:null, communityUnsub:null, presenceCache:new Map(),
  pvpStartTime:0, pvpTimer:null, pvpMistakes:0, pvpKeys:0, pvpCorrectText:"",
  pvpLesson:null, pvpAttemptId:null, pvpFinished:false, pvpActiveRoom:null,
  pvpProgressTimer:null, pvpProgressLastSent:0, pvpResultSaved:false
};

const studentEmail = id => `${String(id).trim()}@student.thc-nr.local`;
const esc = v => String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const fmtDate = v => { try { return v?.toDate?.().toLocaleString("th-TH") || "-"; } catch { return "-"; } };
const fmtTime = s => { s=Math.max(0,s); return `${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60).toString().padStart(2,"0")}`; };

function showScreen(id){
  ["authScreen","userPortal","gameScreen","resultScreen","pvpGameScreen"].forEach(x => $(x)?.classList.toggle("hidden", x !== id));
  const playing = id === "gameScreen" || id === "pvpGameScreen";
  document.body.classList.toggle("game-active", playing);
  if (!playing) window.scrollTo({top:0,behavior:"smooth"});
}

function difficultyName(id){ return DIFFICULTIES.find(x=>x.id===id)?.name || id; }
function difficultyIcon(id){ return DIFFICULTIES.find(x=>x.id===id)?.icon || "●"; }
function languageLessons(){ return LESSONS.filter(x => x.language === state.language?.id).sort((a,b)=>a.stage-b.stage); }
function maxUnlocked(languageId){
  return Number(state.player?.progress?.[languageId]?.maxUnlockedStage || 1);
}

async function ensureProfileDefaults(){
  if(!state.uid) return;
  const ref = doc(db,"users",state.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()) return;
  const d = snap.data();
  const patch = {};
  if(typeof d.tokenBalance !== "number") {
    patch.tokenBalance = typeof d.pointsBalance === "number" ? d.pointsBalance : 0;
  }
  if(typeof d.tokenLifetime !== "number") {
    patch.tokenLifetime = typeof d.pointsLifetime === "number" ? d.pointsLifetime : 0;
  }
  if(!Array.isArray(d.inventory)) patch.inventory = [];
  if(!d.progress) patch.progress = {html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}};
  else {
    patch.progress = {
      html:{maxUnlockedStage:Number(d.progress?.html?.maxUnlockedStage || 1)},
      python:{maxUnlockedStage:Number(d.progress?.python?.maxUnlockedStage || 1)}
    };
  }
  if(!d.character) {
    patch.character = {...DEFAULT_CHARACTER,displayName:d.fullName||""};
  } else {
    patch.character = {
      ...DEFAULT_CHARACTER,
      ...d.character,
      displayName:d.character.displayName||d.fullName||"",
      equipped:{...DEFAULT_CHARACTER.equipped,...(d.character.equipped||{})}
    };
  }
  if(!d.zone) patch.zone = {...DEFAULT_ZONE_STATE};
  if(Object.keys(patch).length) await updateDoc(ref,patch);
  const refreshed = await getDoc(ref);
  state.player = {uid:state.uid,...refreshed.data()};
}

$("loginTab").onclick=()=>{$("loginTab").classList.add("active");$("registerTab").classList.remove("active");$("loginPanel").classList.remove("hidden");$("registerPanel").classList.add("hidden")};
$("registerTab").onclick=()=>{$("registerTab").classList.add("active");$("loginTab").classList.remove("active");$("registerPanel").classList.remove("hidden");$("loginPanel").classList.add("hidden")};
document.querySelectorAll("[data-toggle-password]").forEach(btn=>btn.onclick=()=>{const i=$(btn.dataset.togglePassword);i.type=i.type==="password"?"text":"password";btn.textContent=i.type==="password"?"แสดง":"ซ่อน"});

function registerValid(){
  return /^\d+$/.test($("studentId").value.trim()) &&
    $("fullName").value.trim() && $("educationLevel").value && $("classroom").value &&
    $("department").value.trim() && $("password").value.length >= 6 &&
    $("password").value === $("confirmPassword").value && $("acceptRules").checked;
}
function updateRegister(){ $("registerButton").disabled = !registerValid(); }
["studentId","fullName","educationLevel","classroom","department","password","confirmPassword","acceptRules"].forEach(id=>$(id).addEventListener("input",updateRegister));

$("registerForm").addEventListener("submit",async e=>{
  e.preventDefault(); if(!registerValid()) return;
  try{
    const sid=$("studentId").value.trim();
    const cred=await createUserWithEmailAndPassword(auth,studentEmail(sid),$("password").value);
    state.uid=cred.user.uid;
    const p={
      uid:state.uid,studentId:sid,fullName:$("fullName").value.trim(),
      educationLevel:$("educationLevel").value,classroom:$("classroom").value,
      department:$("department").value.trim(),role:"student",status:"active",
      tokenBalance:0,tokenLifetime:0,inventory:[],
      officialProgress:{},officialSubmitted:false,
      rank:{seasonId:null,rating:0,tierId:"bronze",tierName:"Bronze"},
      progress:{html:{maxUnlockedStage:1},python:{maxUnlockedStage:1}},
      character:{...DEFAULT_CHARACTER,displayName:$("fullName").value.trim()},
      zone:{...DEFAULT_ZONE_STATE},
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    };
    await setDoc(doc(db,"users",state.uid),p);
    await routeAuthenticatedStudent();
  }catch(err){
    $("registerMessage").textContent = err.code==="auth/email-already-in-use" ? "เลขนักศึกษานี้ลงทะเบียนแล้ว" : "ลงทะเบียนไม่สำเร็จ: "+err.message;
  }
});

$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    const cred=await signInWithEmailAndPassword(auth,studentEmail($("loginStudentId").value.trim()),$("loginPassword").value);
    state.uid=cred.user.uid;
    await routeAuthenticatedStudent();
  }catch{
    $("loginMessage").textContent="เลขนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
  }
});

async function routeAuthenticatedStudent(){
  // createUserWithEmailAndPassword จะยิง onAuthStateChanged ก่อน setDoc(users/{uid}) ได้
  // จึง retry สั้น ๆ เพื่อป้องกันหน้า Login กระพริบ/แจ้งไม่พบ User ตอนสมัครใหม่
  for(let i=0;i<6&&!state.player;i++){
    await ensureProfileDefaults();
    if(!state.player) await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!state.player) throw new Error("ไม่พบข้อมูลผู้ใช้");

  // มือถือ/แท็บเล็ต: Login/สมัครได้ที่หน้าแรก แต่หลังมีตัวละครแล้วเข้า Zone โดยตรง
  if(isMobileOrTabletDevice() && ["male","female"].includes(state.player?.character?.gender)){
    try{
      await syncPublicProfile();
      await writePresence("zone");
    }catch(error){
      console.warn("mobile route sync skipped:", error);
    }
    location.replace("./zone.html?v=4.3.0");
    return;
  }

  await enterPortal();
}

async function enterPortal(){
  await ensureProfileDefaults();
  showScreen("userPortal");
  $("portalWelcome").textContent=`${state.player.fullName} · ${state.player.studentId} · ${state.player.educationLevel}${state.player.classroom}`;
  $("userTokens").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  renderUserRank();
  renderLanguages();
  renderRewardShop();
  listenHistory();
  startSocialHub();
  setupCharacterUi();

  if(!["male","female"].includes(state.player?.character?.gender)){
    $("characterSetupModal")?.classList.remove("hidden");
  }

  // คำนวณ Rank ของ Season ปัจจุบันเมื่อ User เข้าใช้งาน
  // ถ้าครบรอบ 60 วัน seasonId จะเปลี่ยนโดยอัตโนมัติ
  try {
    await updateMyRank();
    await ensureProfileDefaults();
    renderUserRank();
    await syncPublicProfile();
    await writePresence("portal");
  } catch (error) {
    console.warn("Ranking update skipped:", error);
  }
}

$("logoutUserButton").onclick=async()=>{
  await markOffline();
  if(state.historyUnsub) state.historyUnsub();
  if(state.presenceUnsub) state.presenceUnsub();
  if(state.communityUnsub) state.communityUnsub();
  if(state.leaderboardUnsub) state.leaderboardUnsub();
  clearInterval(state.presenceTimer);
  await signOut(auth);
};

function renderLanguages(){
  $("languageCards").innerHTML=LANGUAGES.map(l=>`
    <button class="language-card ${state.language?.id===l.id?"selected":""} ${l.comingSoon?"coming-soon":""}" data-lang="${l.id}" ${l.comingSoon?"disabled":""}>
      <span>${l.icon}</span>
      <strong>${l.name}</strong>
      <b>${esc(l.tagline)}</b>
      <small>${esc(l.description)}</small>
      <em>${l.comingSoon?"COMING SOON":`${l.stageCount} ด่าน`}</em>
    </button>`).join("");
  document.querySelectorAll("[data-lang]:not([disabled])").forEach(b=>b.onclick=()=>selectLanguage(b.dataset.lang));
}

function selectLanguage(id){
  state.language=LANGUAGES.find(x=>x.id===id);
  state.lesson=null;
  state.difficulty=null;
  renderLanguages();
  $("learningSection").classList.remove("hidden");
  $("modeSection").classList.remove("hidden");
  $("classicConfig").classList.remove("hidden");
  $("learningTitle").textContent=`${state.language.icon} ${state.language.name} · 50 STAGES`;
  $("learningTagline").textContent=state.language.description;
  renderLessonTabs();
  renderDifficulty();
  renderClassicStages();
  renderLessonDetail();
  updateClassicSummary();
  $("learningSection").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderLessonTabs(){
  $("lessonTabs").innerHTML=DIFFICULTIES.map(d=>`
    <button class="lesson-tab ${state.difficulty?.id===d.id?"active":""}" data-learn-diff="${d.id}">
      <span>${d.icon}</span><strong>${d.name}</strong><small>ด่าน ${d.from}–${d.to}</small>
    </button>`).join("");
  document.querySelectorAll("[data-learn-diff]").forEach(b=>b.onclick=()=>{
    state.difficulty=DIFFICULTIES.find(x=>x.id===b.dataset.learnDiff);
    const unlocked=maxUnlocked(state.language.id);
    const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
    state.lesson=list.find(x=>x.stage<=unlocked) || list[0];
    renderLessonTabs();renderStageSelector();renderLessonDetail();renderDifficulty();renderClassicStages();updateClassicSummary();
  });
  renderStageSelector();
}

function renderStageSelector(){
  if(!state.language){$("stageSelector").innerHTML="";return;}
  const d=state.difficulty || DIFFICULTIES[0];
  const unlocked=maxUnlocked(state.language.id);
  const list=languageLessons().filter(x=>x.difficulty===d.id);
  $("stageSelector").innerHTML=`<div class="stage-selector-head"><strong>บทเรียน ${d.name}</strong><span>ปลดล็อกถึงด่าน ${unlocked}</span></div><div class="mini-stage-grid">${
    list.map(l=>`<button data-learn-stage="${l.stage}" class="${state.lesson?.stage===l.stage?"selected":""}" ${l.stage>unlocked?"disabled":""}>${l.stage}${l.stage>unlocked?" 🔒":""}</button>`).join("")
  }</div>`;
  document.querySelectorAll("[data-learn-stage]:not([disabled])").forEach(b=>b.onclick=()=>{
    state.lesson=languageLessons().find(x=>x.stage===Number(b.dataset.learnStage));
    state.difficulty=DIFFICULTIES.find(x=>x.id===state.lesson.difficulty);
    renderLessonTabs();renderStageSelector();renderLessonDetail();renderDifficulty();renderClassicStages();updateClassicSummary();
  });
}

function previewSrcdoc(l){
  if(l.language==="html") return l.code;
  return "";
}

function renderLessonDetail(){
  const l=state.lesson || languageLessons()[0];
  if(!l) return;
  state.lesson=l;
  const preview=l.language==="html";
  $("lessonDetail").innerHTML=`<div class="education-grid">
    <div class="edu-info">
      <div class="edu-card"><h3>📘 คำอธิบาย</h3><p>${esc(l.description)}</p></div>
      <div class="edu-card"><h3>🛠️ วิธีการใช้งาน</h3><p>${esc(l.usage)}</p></div>
      <div class="edu-card benefit"><h3>💡 ประโยชน์</h3><p>${esc(l.benefit)}</p></div>
      <div class="edu-card"><h3>🔎 อธิบายผลลัพธ์</h3><p>${esc(l.outputExplain)}</p></div>
    </div>
    <div>
      <h3 class="edu-heading">Stage ${l.stage} · ตัวอย่าง Code</h3>
      <pre class="lesson-code"><code>${esc(l.code)}</code></pre>
      <div class="preview-panel">
        <div class="preview-bar"><i></i><i></i><i></i><span>${preview?"LIVE PREVIEW":"EXPECTED RESULT"}</span></div>
        ${preview?`<iframe id="lessonPreview" sandbox="allow-scripts"></iframe>`:`<pre class="terminal-output">${esc(l.output||l.outputExplain)}</pre>`}
      </div>
    </div>
  </div>`;
  if(preview) setTimeout(()=>{const f=$("lessonPreview");if(f)f.srcdoc=previewSrcdoc(l)},20);
}

document.querySelectorAll("[data-game-mode]").forEach(b=>b.onclick=()=>{
  state.gameMode=b.dataset.gameMode;
  document.querySelectorAll("[data-game-mode]").forEach(x=>x.classList.toggle("selected",x===b));
  $("classicConfig").classList.toggle("hidden",state.gameMode!=="classic");
  $("officialConfig").classList.toggle("hidden",state.gameMode!=="official");
  $("pvpConfig").classList.toggle("hidden",state.gameMode!=="pvp");
  if(state.gameMode==="official") renderOfficialStages();
});

function renderDifficulty(){
  $("difficultyCards").innerHTML=DIFFICULTIES.map(d=>`
    <button class="difficulty-card ${state.difficulty?.id===d.id?"selected":""}" data-difficulty="${d.id}">
      <span>${d.icon}</span><strong>${d.name}</strong><small>${d.description}</small><b>Score ×${d.multiplier.toFixed(2)}</b>
    </button>`).join("");
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.onclick=()=>{
    state.difficulty=DIFFICULTIES.find(x=>x.id===b.dataset.difficulty);
    const unlocked=maxUnlocked(state.language.id);
    const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
    state.lesson=list.find(x=>x.stage<=unlocked) || null;
    renderDifficulty();renderClassicStages();renderLessonTabs();renderStageSelector();if(state.lesson)renderLessonDetail();updateClassicSummary();
  });
}

function renderClassicStages(){
  if(!state.language || !state.difficulty){$("classicStageGrid").innerHTML=`<p class="empty-card">เลือกระดับความยากก่อน</p>`;return;}
  const unlocked=maxUnlocked(state.language.id);
  const list=languageLessons().filter(x=>x.difficulty===state.difficulty.id);
  $("classicStageGrid").innerHTML=list.map(l=>`
    <button class="classic-stage ${state.lesson?.id===l.id?"selected":""}" data-classic-stage="${l.stage}" ${l.stage>unlocked?"disabled":""}>
      <strong>${String(l.stage).padStart(2,"0")}</strong><span>${esc(l.title)}</span><small>${l.rewardPoints} pts ${l.stage>unlocked?"· 🔒":""}</small>
    </button>`).join("");
  document.querySelectorAll("[data-classic-stage]:not([disabled])").forEach(b=>b.onclick=()=>{
    state.lesson=languageLessons().find(x=>x.stage===Number(b.dataset.classicStage));
    renderClassicStages();renderStageSelector();renderLessonDetail();updateClassicSummary();
  });
}

function updateClassicSummary(){
  const ok=state.language&&state.difficulty&&state.lesson&&state.lesson.stage<=maxUnlocked(state.language.id);
  $("startClassicButton").disabled=!ok;
  $("classicLessonSummary").textContent=ok?`${state.language.name} · ${state.difficulty.name} · ด่าน ${state.lesson.stage} · รับ ${state.lesson.rewardPoints} แต้ม`:"เลือกภาษาระดับและด่านที่ปลดล็อกแล้ว";
}

$("startClassicButton").onclick=async()=>{
  if(!state.lesson)return;
  prepareClassic();
  showScreen("gameScreen");
  await requestRealFullscreen();
  setTimeout(()=>$("typingInput").focus({preventScroll:true}),150);
};

async function requestRealFullscreen(){
  document.body.classList.add("game-active");
  updateDeviceUX();

  // CSS 100dvh เป็นตัวหลักสำหรับมือถือ โดยเฉพาะ iOS Safari
  // Fullscreen API ใช้เสริมเมื่อ Browser รองรับและอนุญาต
  try{
    const canFullscreen = document.documentElement.requestFullscreen;
    if (canFullscreen && !document.fullscreenElement && !isPhoneLayout()) {
      await document.documentElement.requestFullscreen();
    }
  }catch(error){
    console.warn("Fullscreen API unavailable:", error);
  }
}
async function leaveRealFullscreen(){
  try{if(document.fullscreenElement)await document.exitFullscreen()}catch{}
}
$("fullscreenButton").onclick=requestRealFullscreen;

function elapsed(){return state.started?(performance.now()-state.startTime)/1000:0}
function accuracy(){return state.keystrokes?Math.max(0,(state.correctText.length/state.keystrokes)*100):100}
function wpm(){return state.correctText.length?((state.correctText.length/5)/Math.max(elapsed()/60,1/600)):0}
function liveScore(){
  if(!state.started)return 0;
  const base=Number(state.lesson.basePoints||100)*(state.difficulty?.multiplier||1);
  return Math.max(0,Math.round(base*(accuracy()/100)+Math.min(base*.35,wpm()*2)-state.mistakes*4));
}

function prepareClassic(){
  state.attemptId=null;state.started=false;state.finished=false;state.mistakes=0;state.keystrokes=0;state.correctText="";
  clearInterval(state.timer);$("typingInput").value="";
  $("modeBadge").textContent=`⌨️ CLASSIC · ${state.language.name}`;
  $("challengeTitle").textContent=`Stage ${state.lesson.stage} · ${state.lesson.title}`;
  $("challengeDescription").textContent=state.lesson.description;
  $("playerName").textContent=state.player.fullName;
  $("statLevel").textContent=String(state.lesson.stage).padStart(2,"0");
  $("languageLabel").textContent=state.language.name;
  $("difficultyLabel").textContent=state.difficulty.name;
  $("timeRuleLabel").textContent=`เป้าหมาย ${state.lesson.timeLimit}s`;
  $("fileName").textContent=`${state.language.id}_stage_${String(state.lesson.stage).padStart(2,"0")}`;
  $("typingStatus").textContent="พิมพ์ตัวแรกเพื่อเริ่มจับเวลา";
  $("saveState").textContent=`รางวัล ${state.lesson.rewardPoints} Token`;
  $("statTime").textContent="00:00";
  ["statWpm","statMistakes","statScore"].forEach(id=>$(id).textContent="0");
  $("statAccuracy").textContent="100%";
  renderStrictCode();
  updateDeviceUX();
  syncMobileStats();
}

async function startClassic(){
  if(state.started)return;
  state.started=true;state.startTime=performance.now();$("typingStatus").textContent="กำลังเล่น...";
  const r=await addDoc(collection(db,"attempts"),{
    uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,
    educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,
    language:state.language.name,languageId:state.language.id,modeName:state.gameMode==="official"?"Official":"Classic",
    difficulty:state.difficulty.name,difficultyId:state.difficulty.id,stage:state.lesson.stage,
    lessonId:state.lesson.id,levelTitle:state.lesson.title,status:"playing",
    score:0,rewardPoints:state.gameMode==="official"?0:state.lesson.rewardPoints,wpm:0,accuracy:0,mistakes:0,elapsedSeconds:0,createdAt:serverTimestamp()
  });
  state.attemptId=r.id;
  state.timer=setInterval(updateClassicStats,100);
}

function renderStrictCode(){
  const code=state.lesson?.code||"";
  let h="";
  for(let i=0;i<code.length;i++){
    let cls=i<state.correctText.length?"correct":(i===state.correctText.length?"current":"pending");
    const ch=code[i];
    const display=ch==="\n"?"\n":ch===" "?" ":esc(ch);
    h+=`<span class="${cls}">${display}</span>`;
  }
  $("typingDisplay").innerHTML=h;
  const pct=code.length?state.correctText.length/code.length*100:0;
  $("progressBar").style.width=`${pct}%`;
  $("progressText").textContent=`${state.correctText.length} / ${code.length}`;
  $("typingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});
}

function shakeWrong(expected,pressed){
  const shell=$("gameShell");
  shell.classList.remove("wrong-shake");
  void shell.offsetWidth;
  shell.classList.add("wrong-shake");
  $("typingStage").classList.add("wrong-flash");
  $("typingStatus").textContent=`ผิด: ต้องพิมพ์ ${expected==="\n"?"Enter":expected===" "?"Space":expected}`;
  setTimeout(()=>{$("typingStage").classList.remove("wrong-flash");shell.classList.remove("wrong-shake");$("typingStatus").textContent="พิมพ์ตัวเดิมใหม่ให้ถูก — ไม่ต้อง Backspace";},260);
}

function keyToInput(e){
  if(e.key==="Enter")return "\n";
  if(e.key==="Tab")return "\t";
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey)return e.key;
  return null;
}

$("typingStage").onclick=()=> $("typingInput").focus({preventScroll:true});

$("typingInput").addEventListener("keydown",async e=>{
  if(state.finished){e.preventDefault();return;}
  if(["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
    e.preventDefault();$("typingStatus").textContent="Strict Mode: ไม่ต้องลบ พิมพ์ตัวที่ค้างให้ถูก";return;
  }
  const raw=keyToInput(e);
  if(raw===null)return;
  e.preventDefault();
  if(!state.started)await startClassic();

  const code=state.lesson.code;
  const pos=state.correctText.length;
  const expected=code[pos];
  state.keystrokes++;

  if(raw==="\t"){
    if(expected===" "){
      let count=0;
      while(code[pos+count]===" "&&count<4)count++;
      state.correctText+=code.slice(pos,pos+count);
      renderStrictCode();updateClassicStats();
      if(state.correctText===code)finishClassic();
    }else{
      state.mistakes++;shakeWrong(expected,"Tab");updateClassicStats();
    }
    return;
  }

  if(raw===expected){
    state.correctText+=raw;
    renderStrictCode();
    $("typingStatus").textContent="ถูก ✓";
    updateClassicStats();
    if(state.correctText===code)finishClassic();
  }else{
    state.mistakes++;
    shakeWrong(expected,raw);
    updateClassicStats();
  }
});

function updateClassicStats(){
  $("statTime").textContent=fmtTime(elapsed());
  $("statWpm").textContent=Math.round(wpm());
  $("statAccuracy").textContent=`${accuracy().toFixed(0)}%`;
  $("statMistakes").textContent=state.mistakes;
  $("statScore").textContent=state.gameMode==="official"?"—":Number(state.lesson.rewardPoints||0);
  syncMobileStats();
}

async function awardCompletion(){
  const ref=doc(db,"users",state.uid);
  const lang=state.language.id;
  const stage=state.lesson.stage;
  const reward=Number(state.lesson.rewardPoints||0);
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists())return;
    const d=snap.data();
    const currentUnlocked=Number(d.progress?.[lang]?.maxUnlockedStage||1);
    const newUnlocked=Math.max(currentUnlocked,Math.min(50,stage+1));
    const progress={...(d.progress||{})};
    progress[lang]={...(progress[lang]||{}),maxUnlockedStage:newUnlocked};
    tx.update(ref,{
      tokenBalance:Number(d.tokenBalance||0)+reward,
      tokenLifetime:Number(d.tokenLifetime||0)+reward,
      progress,
      updatedAt:serverTimestamp()
    });
  });
  await ensureProfileDefaults();
}

async function finishClassic(){
  if(state.finished)return;
  state.finished=true;
  clearInterval(state.timer);

  const e=elapsed();
  const wp=Math.round(((state.correctText.length/5)/Math.max(e/60,1/60))*100)/100;
  const acc=Math.round(accuracy()*100)/100;
  const score=liveScore();

  if(state.gameMode==="official"){
    const item=state.officialSelected;
    const officialScore=calculateOfficialStageScore(item,acc,wp,e);

    if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
      status:"completed",
      modeName:"Official",
      officialStage:item.officialStage,
      academicScore:officialScore,
      academicMaxScore:item.maxScore,
      score:0,
      rewardPoints:0,
      wpm:wp,accuracy:acc,mistakes:state.mistakes,
      elapsedSeconds:Math.round(e*100)/100,
      finishedAt:serverTimestamp()
    });

    await saveOfficialStage(item,officialScore,acc,wp,Math.round(e*100)/100);
    await updateMyRank();

    $("resultTitle").textContent=`ผ่านด่านทางการ ${item.officialStage}/30`;
    $("resultText").textContent="ผลคะแนนถูกเก็บสำหรับครู และจะส่งจริงเมื่อทำครบ 30 ด่านแล้วกดส่งงาน";
    $("resultScore").textContent="บันทึกแล้ว";
    $("resultWpm").textContent=wp;
    $("resultAccuracy").textContent=`${acc}%`;
    $("resultTime").textContent=`${e.toFixed(2)}s`;
    $("nextLevelButton").style.display="none";

    await leaveRealFullscreen();
    showScreen("resultScreen");
    return;
  }

  if(state.attemptId)await updateDoc(doc(db,"attempts",state.attemptId),{
    status:"completed",score,rewardPoints:state.lesson.rewardPoints,wpm:wp,accuracy:acc,
    mistakes:state.mistakes,elapsedSeconds:Math.round(e*100)/100,finishedAt:serverTimestamp()
  });

  await awardCompletion();
  await updateMyRank();

  $("resultTitle").textContent=`ผ่าน Stage ${state.lesson.stage} +${state.lesson.rewardPoints} Token`;
  $("resultText").textContent=`${state.language.name} · ${state.difficulty.name} · ${state.lesson.title}`;
  $("resultScore").textContent=`+${state.lesson.rewardPoints} Token`;
  $("resultWpm").textContent=wp;
  $("resultAccuracy").textContent=`${acc}%`;
  $("resultTime").textContent=`${e.toFixed(2)}s`;
  $("nextLevelButton").style.display=state.lesson.stage<50?"":"none";

  await leaveRealFullscreen();
  showScreen("resultScreen");
}

$("quitButton").onclick=async()=>{
  if(state.attemptId&&!state.finished)await updateDoc(doc(db,"attempts",state.attemptId),{status:"abandoned",finishedAt:serverTimestamp()});
  clearInterval(state.timer);await leaveRealFullscreen();showScreen("userPortal");
};
$("playAgainButton").onclick=async()=>{prepareClassic();showScreen("gameScreen");await requestRealFullscreen();setTimeout(()=>$("typingInput").focus(),100)};
$("nextLevelButton").onclick=async()=>{
  const next=languageLessons().find(x=>x.stage===state.lesson.stage+1);
  if(!next)return;
  state.lesson=next;state.difficulty=DIFFICULTIES.find(x=>x.id===next.difficulty);
  prepareClassic();showScreen("gameScreen");await requestRealFullscreen();setTimeout(()=>$("typingInput").focus({preventScroll:true}),100);
};
$("portalButton").onclick=async()=>{await ensureProfileDefaults();await enterPortal()};

function renderRewardShop(){
  if(!$("rewardShop"))return;
  const balance=Number(state.player?.tokenBalance||0);
  const owned=new Set(state.player?.inventory||[]);

  const items=[...REWARD_ITEMS].sort((a,b)=>
    (RARITY_META[a.rarity]?.order||0)-(RARITY_META[b.rarity]?.order||0) || a.cost-b.cost
  );

  $("rewardShop").innerHTML=items.map(item=>`
    <article class="reward-card rarity-${item.rarity} ${owned.has(item.id)?"owned":""}">
      <div class="reward-rarity">${RARITY_META[item.rarity]?.name||item.rarity}</div>
      <div class="reward-icon">${item.icon}</div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
      <div class="reward-slot">SLOT · ${item.slot.toUpperCase()}</div>
      <div class="reward-cost">${item.cost.toLocaleString()} Token</div>
      <button class="btn ${owned.has(item.id)?"ghost":"secondary"}" data-redeem="${item.id}" ${owned.has(item.id)||balance<item.cost?"disabled":""}>
        ${owned.has(item.id)?"มีแล้ว":balance<item.cost?"Token ไม่พอ":"แลกไอเท็ม"}
      </button>
    </article>`).join("");

  document.querySelectorAll("[data-redeem]:not([disabled])").forEach(b=>{
    b.onclick=()=>redeemReward(b.dataset.redeem);
  });
}
async function redeemReward(id){
  const item=REWARD_ITEMS.find(x=>x.id===id);
  if(!item)return;
  const ref=doc(db,"users",state.uid);
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      const d=snap.data();
      const balance=Number(d.tokenBalance||0);
      const inv=Array.isArray(d.inventory)?d.inventory:[];
      if(inv.includes(id))throw new Error("มีไอเทมแล้ว");
      if(balance<item.cost)throw new Error("แต้มไม่พอ");
      tx.update(ref,{tokenBalance:balance-item.cost,inventory:[...inv,id],updatedAt:serverTimestamp()});
    });
    await ensureProfileDefaults();
    $("userTokens").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  renderUserRank();
    renderRewardShop();
    if(!$("characterProfileModal")?.classList.contains("hidden")) renderCharacterProfile();
  }catch(err){alert(err.message)}
}

function listenHistory(){
  if(state.historyUnsub)state.historyUnsub();
  state.historyUnsub=onSnapshot(query(collection(db,"attempts"),where("uid","==",state.uid)),snap=>{
    const rows=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.toDate?.()?.getTime?.()||0)-(a.createdAt?.toDate?.()?.getTime?.()||0));
    const done=rows.filter(x=>x.status==="completed");
    $("userTotalAttempts").textContent=rows.length;
    $("userCompleted").textContent=done.length;
    $("userBestScore").textContent=Math.max(0,...done.map(x=>Number(x.score||0))).toLocaleString();
    $("userBestWpm").textContent=Math.max(0,...done.map(x=>Number(x.wpm||0))).toFixed(0);
    $("userHistoryBody").innerHTML=rows.slice(0,10).map(x=>`<tr><td>${fmtDate(x.createdAt)}</td><td>${esc(x.language||"-")}</td><td>${esc(x.modeName||"-")}</td><td>${esc(x.difficulty||"-")}</td><td>${esc(x.status)}</td><td>${Number(x.score||0).toLocaleString()}</td><td>${Number(x.wpm||0).toFixed(1)}</td><td>${Number(x.accuracy||0).toFixed(1)}%</td></tr>`).join("")||`<tr><td colspan="8" class="empty">ยังไม่มีประวัติ</td></tr>`;
  });
}


function renderUserRank(){
  const rank=state.player?.rank || {};
  const tierIcon=rank.tierIcon || "🥉";
  const tierName=rank.tierName || "Bronze";
  const rating=Number(rank.rating||0);
  $("userRank").innerHTML=`${rankShieldHTML(rank,"small")} <span>${tierName} ${rating}</span>`;
  const range=seasonRange(new Date());
  $("rankSeasonLabel").textContent=`${seasonIdFromDate(new Date())} · ${range.end.toLocaleDateString("th-TH")}`;
}

function officialStageSource(item){
  return LESSONS.find(l=>l.language===item.language && Number(l.stage)===Number(item.sourceStage));
}

function officialProgressMap(){
  return state.player?.officialProgress || {};
}

function renderOfficialStages(){
  const progress=officialProgressMap();
  const done=OFFICIAL_STAGES.filter(s=>progress[String(s.officialStage)]?.completed).length;
  $("officialCompletedCount").textContent=done;
  $("officialSubmitStatus").textContent=state.player?.officialSubmitted ? "ส่งแล้ว" : "ยังไม่ส่ง";
  $("submitOfficialButton").disabled = done !== OFFICIAL_STAGES.length || !!state.player?.officialSubmitted;

  $("officialStageGrid").innerHTML=OFFICIAL_STAGES.map(item=>{
    const p=progress[String(item.officialStage)]||{};
    return `<button class="official-stage ${p.completed?"completed":""}" data-official="${item.officialStage}">
      <span>${String(item.officialStage).padStart(2,"0")}</span>
      <strong>${item.languageName} · ${esc(item.title)}</strong>
      <small>${p.completed?"✓ ทำแล้ว":"ยังไม่ทำ"} · ${item.maxScore} คะแนน</small>
    </button>`;
  }).join("");

  document.querySelectorAll("[data-official]").forEach(b=>b.onclick=()=>startOfficialStage(Number(b.dataset.official)));
}

async function startOfficialStage(stageNo){
  const item=OFFICIAL_STAGES.find(x=>x.officialStage===stageNo);
  const lesson=officialStageSource(item);
  if(!item||!lesson)return;
  state.gameMode="official";
  state.officialSelected=item;
  state.language=LANGUAGES.find(x=>x.id===item.language);
  state.lesson=lesson;
  state.difficulty=DIFFICULTIES.find(x=>x.id===lesson.difficulty);
  prepareClassic();
  $("modeBadge").textContent=`📋 ทางการ · ${item.languageName}`;
  $("challengeTitle").textContent=`ทางการ ${stageNo}/30 · ${item.title}`;
  $("statScore").textContent="—";
  $("saveState").textContent=`คะแนนเต็ม ${item.maxScore} · ส่งให้ Admin เมื่อส่งงานครบ`;
  showScreen("gameScreen");
  await requestRealFullscreen();
  setTimeout(()=>$("typingInput").focus({preventScroll:true}),120);
}

function calculateOfficialStageScore(item, acc, wp, elapsedSeconds){
  // คะแนนทางการเน้นความถูกต้องก่อน แล้วค่อยโบนัสความเร็ว
  const accuracyRatio=Math.max(0,Math.min(1,acc/100));
  const timeTarget=Number(state.lesson?.timeLimit||90);
  const speedRatio=Math.max(0,Math.min(1,timeTarget/Math.max(elapsedSeconds,1)));
  const normalized=accuracyRatio*0.85 + speedRatio*0.15;
  return Math.max(0,Math.min(item.maxScore,Math.round(item.maxScore*normalized*100)/100));
}

async function saveOfficialStage(item, score, acc, wp, elapsedSeconds){
  const ref=doc(db,"users",state.uid);
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists())return;
    const d=snap.data();
    const officialProgress={...(d.officialProgress||{})};
    const prev=officialProgress[String(item.officialStage)];
    // เก็บผลดีที่สุดของด่าน
    if(!prev || Number(score)>Number(prev.score||0)){
      officialProgress[String(item.officialStage)]={
        completed:true,
        score,
        maxScore:item.maxScore,
        accuracy:acc,
        wpm:wp,
        elapsedSeconds,
        lessonId:state.lesson.id,
        updatedAt:new Date().toISOString()
      };
    }
    tx.update(ref,{officialProgress,updatedAt:serverTimestamp()});
  });
  await ensureProfileDefaults();
}

$("submitOfficialButton").onclick=async()=>{
  const progress=officialProgressMap();
  const completed=OFFICIAL_STAGES.filter(s=>progress[String(s.officialStage)]?.completed);
  if(completed.length!==30){alert("ต้องทำครบ 30 ด่านก่อนส่งงาน");return;}
  if(state.player?.officialSubmitted){alert("ส่งงานทางการแล้ว");return;}

  const totalScore=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.score||0),0);
  const avgAccuracy=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.accuracy||0),0)/30;
  const avgWpm=OFFICIAL_STAGES.reduce((sum,s)=>sum+Number(progress[String(s.officialStage)]?.wpm||0),0)/30;

  const submission={
    uid:state.uid,
    studentId:state.player.studentId,
    fullName:state.player.fullName,
    educationLevel:state.player.educationLevel,
    classroom:state.player.classroom,
    department:state.player.department,
    completedStages:30,
    totalScore:Math.round(totalScore*100)/100,
    maxScore:OFFICIAL_TOTAL_SCORE,
    avgAccuracy:Math.round(avgAccuracy*10)/10,
    avgWpm:Math.round(avgWpm*10)/10,
    progress,
    submittedAt:serverTimestamp()
  };

  await setDoc(doc(db,"official_submissions",state.uid),submission);
  await updateDoc(doc(db,"users",state.uid),{officialSubmitted:true,officialSubmittedAt:serverTimestamp()});
  await ensureProfileDefaults();
  renderOfficialStages();
  alert("ส่งงานทางการให้ครูเรียบร้อยแล้ว");
}

async function updateMyRank(){
  const seasonId=seasonIdFromDate(new Date());
  const range=seasonRange(new Date());

  const attempts=[];
  // ใช้ข้อมูลจาก history listener ผ่าน Firestore query ใหม่ให้ชัดเจน
  const snap=await getDocs(query(collection(db,"attempts"),where("uid","==",state.uid)));
  snap.forEach(d=>{
    const a=d.data();
    const dt=a.createdAt?.toDate?.();
    if(dt && dt>=range.start && dt<=range.end)attempts.push(a);
  });

  const activeDays=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
  const metrics=calculateRankMetrics(attempts,activeDays);
  const rank={seasonId,...metrics,updatedAt:new Date().toISOString()};
  await updateDoc(doc(db,"users",state.uid),{rank,updatedAt:serverTimestamp()});
  state.player.rank=rank;
  renderUserRank();
}



/* ===== V3.8 CHARACTER PROFILE + TOKEN FASHION ===== */
function setupCharacterUi(){
  if($("openCharacterProfileButton")) $("openCharacterProfileButton").onclick=openCharacterProfile;
  if($("closeCharacterProfileButton")) $("closeCharacterProfileButton").onclick=()=>$("characterProfileModal").classList.add("hidden");
  if($("selectMaleCharacter")) $("selectMaleCharacter").onclick=()=>saveCharacterGender("male");
  if($("selectFemaleCharacter")) $("selectFemaleCharacter").onclick=()=>saveCharacterGender("female");
  if($("unequipAllButton")) $("unequipAllButton").onclick=unequipAllItems;
}

async function saveCharacterGender(gender){
  if(!state.uid||!["male","female"].includes(gender))return;

  const character={
    ...DEFAULT_CHARACTER,
    ...(state.player.character||{}),
    gender,
    displayName:state.player.fullName||"",
    equipped:{...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})}
  };

  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;
  $("characterSetupModal").classList.add("hidden");
  await syncPublicProfile();

  // มือถือ/แท็บเล็ตใช้เฉพาะ 2D Zone หลังเลือกตัวละครเสร็จ
  if(isMobileOrTabletDevice()){
    location.replace("./zone.html?v=4.3.0");
  }
}

function characterEquippedItem(slot){
  const id=state.player?.character?.equipped?.[slot];
  return REWARD_ITEMS.find(x=>x.id===id)||null;
}

function applyCharacterVisual(){
  const el=$("profileCharacter");
  if(!el)return;

  el.className=`game-character ${state.player?.character?.gender||"male"}`;

  ["head","face","top","bottom","back","hand","pet"].forEach(slot=>{
    const node=el.querySelector(`.char-${slot}-item`);
    const item=characterEquippedItem(slot);
    if(node){
      node.dataset.visual=item?.visual||"";
      node.dataset.rarity=item?.rarity||"";
      node.title=item?.name||"";
    }
  });

  const aura=characterEquippedItem("aura");
  const auraNode=el.querySelector(".char-aura");
  if(auraNode){
    auraNode.dataset.visual=aura?.visual||"";
    auraNode.dataset.rarity=aura?.rarity||"";
  }

  const shoes=characterEquippedItem("shoes");
  el.querySelectorAll(".char-shoe").forEach(node=>{
    node.dataset.equipped=shoes?.visual||"";
  });
}

function renderCharacterProfile(){
  if(!state.player)return;

  $("characterProfileStudentId").textContent=state.player.studentId||"-";
  $("characterTokenBalance").textContent=Number(state.player.tokenBalance||0).toLocaleString();
  $("characterRankName").textContent=state.player.rank?.tierName||"Bronze";
  $("characterOwnedCount").textContent=(state.player.inventory||[]).length;

  applyCharacterVisual();

  const owned=new Set(state.player.inventory||[]);
  const equippedIds=new Set(Object.values(state.player.character?.equipped||{}).filter(Boolean));

  const items=REWARD_ITEMS
    .filter(item=>owned.has(item.id))
    .sort((a,b)=>(RARITY_META[b.rarity]?.order||0)-(RARITY_META[a.rarity]?.order||0)||b.cost-a.cost);

  $("characterInventoryList").innerHTML=items.length?items.map(item=>`
    <article class="wardrobe-item rarity-${item.rarity} ${equippedIds.has(item.id)?"equipped":""}">
      <div class="wardrobe-icon">${item.icon}</div>
      <div class="wardrobe-info">
        <span>${RARITY_META[item.rarity]?.name||item.rarity}</span>
        <strong>${esc(item.name)}</strong>
        <small>${esc(item.description)}</small>
      </div>
      <div class="wardrobe-action">
        <small>${item.slot.toUpperCase()}</small>
        <button data-equip-item="${item.id}" class="btn ${equippedIds.has(item.id)?"ghost":"secondary"}" type="button">
          ${equippedIds.has(item.id)?"ถอด":"สวมใส่"}
        </button>
      </div>
    </article>
  `).join(""):`<div class="empty-card">ยังไม่มีไอเท็มแต่งตัว ไปที่ Token Shop เพื่อแลกไอเท็ม</div>`;

  document.querySelectorAll("[data-equip-item]").forEach(btn=>{
    btn.onclick=()=>toggleEquipItem(btn.dataset.equipItem);
  });
}

async function openCharacterProfile(){
  await ensureProfileDefaults();
  renderCharacterProfile();
  $("characterProfileModal").classList.remove("hidden");
}

async function toggleEquipItem(itemId){
  const item=REWARD_ITEMS.find(x=>x.id===itemId);
  if(!item||!(state.player.inventory||[]).includes(itemId))return;

  const equipped={...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})};
  equipped[item.slot]=equipped[item.slot]===item.id?null:item.id;

  const character={...DEFAULT_CHARACTER,...state.player.character,equipped};
  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;

  renderCharacterProfile();
  await syncPublicProfile();
}

async function unequipAllItems(){
  const character={
    ...DEFAULT_CHARACTER,
    ...state.player.character,
    equipped:{...DEFAULT_CHARACTER.equipped}
  };
  await updateDoc(doc(db,"users",state.uid),{character,updatedAt:serverTimestamp()});
  state.player.character=character;
  renderCharacterProfile();
  await syncPublicProfile();
}

/* ===== V3.4 SOCIAL HUB: Community + Presence + Top 10 ===== */
const ONLINE_STALE_MS = 90 * 1000;

function rankTierMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={bronze:{name:"Bronze",letter:"B"},silver:{name:"Silver",letter:"S"},gold:{name:"Gold",letter:"G"},platinum:{name:"Platinum",letter:"P"},diamond:{name:"Diamond",letter:"D"},master:{name:"Master",letter:"M"}};
  return {id,...(map[id]||map.bronze)};
}
function rankShieldHTML(rank,size="normal"){
  const t=rankTierMeta(rank);
  return `<span class="rank-shield rank-${t.id} ${size}" title="${t.name} · ${Number(rank?.rating||0)} Rating"><span class="rank-shield-letter">${t.letter}</span></span>`;
}
async function syncPublicProfile(){
  if(!state.uid||!state.player)return;
  try{
    await setDoc(doc(db,"public_profiles",state.uid),{
      uid:state.uid,
      fullName:state.player.fullName,
      studentId:state.player.studentId,
      rank:state.player.rank||{tierId:"bronze",tierName:"Bronze",rating:0},
      avatarId:state.player.character?.avatarId||"default_student",
      character:{
        gender:state.player.character?.gender||null,
        equipped:{...DEFAULT_CHARACTER.equipped,...(state.player.character?.equipped||{})},
        showcaseItemIds:(Array.isArray(state.player.inventory)?state.player.inventory:[]).slice(0,3)
      },
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("public profile:",error)}
}
async function writePresence(area="portal"){
  if(!state.uid||!state.player)return;
  try{
    await setDoc(doc(db,"presence",state.uid),{
      uid:state.uid,fullName:state.player.fullName,studentId:state.player.studentId,
      rank:state.player.rank||null,area,online:true,lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("presence:",error)}
}
async function markOffline(){
  if(!state.uid)return;
  try{await setDoc(doc(db,"presence",state.uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true})}catch{}
}
function presenceOnline(p){
  if(!p?.online)return false;
  const d=p.lastSeenAt?.toDate?.();
  return !d || Date.now()-d.getTime()<=ONLINE_STALE_MS;
}
function renderCommunity(profiles){
  if(!$('communityPlayersList'))return;
  const list=[...profiles].sort((a,b)=>{
    const ao=presenceOnline(state.presenceCache.get(a.uid));
    const bo=presenceOnline(state.presenceCache.get(b.uid));
    if(ao!==bo)return bo-ao;
    return Number(b.rank?.rating||0)-Number(a.rank?.rating||0);
  });
  $('communityPlayersList').innerHTML=list.length?list.map(p=>{
    const pr=state.presenceCache.get(p.uid)||{};
    const online=presenceOnline(pr), me=p.uid===state.uid;
    return `<div class="community-player-row ${online?'online':'offline'} ${me?'me':''}">
      <div class="community-avatar">${esc(String(p.fullName||'?').trim().slice(0,1).toUpperCase())}</div>
      <div class="community-player-info"><strong>${esc(p.fullName||'-')} ${me?'<em>YOU</em>':''}</strong><small>${esc(p.rank?.tierName||'Bronze')} · ${Number(p.rank?.rating||0)} Rating${online?` · ${pr.area==='zone'?'อยู่ใน 2D Zone':'Online'}`:' · Offline'}</small></div>
      ${rankShieldHTML(p.rank,'small')}
      <span class="community-status ${online?'on':'off'}">${online?'ONLINE':'OFFLINE'}</span>
    </div>`;
  }).join(''):`<div class="empty-card">ยังไม่มีผู้เล่นในระบบ</div>`;
}
function listenCommunityPlayers(){
  if(state.communityUnsub)state.communityUnsub();
  let profiles=[];
  state.communityUnsub=onSnapshot(collection(db,"public_profiles"),snap=>{
    profiles=snap.docs.map(d=>({uid:d.id,...d.data()}));renderCommunity(profiles);
  });
  if(state.presenceUnsub)state.presenceUnsub();
  state.presenceUnsub=onSnapshot(collection(db,"presence"),snap=>{
    state.presenceCache=new Map(snap.docs.map(d=>[d.id,{uid:d.id,...d.data()}]));
    const online=[...state.presenceCache.values()].filter(presenceOnline).length;
    if($('onlinePlayerCount'))$('onlinePlayerCount').textContent=online;
    renderCommunity(profiles);
  });
}
function listenTopRanking(){
  if(state.leaderboardUnsub)state.leaderboardUnsub();
  const q=query(collection(db,"public_profiles"),orderBy("rank.rating","desc"),limit(10));
  state.leaderboardUnsub=onSnapshot(q,snap=>{
    const rows=snap.docs.map(d=>({uid:d.id,...d.data()}));
    if($('leaderboardSeason'))$('leaderboardSeason').textContent=seasonIdFromDate(new Date());
    if($('topRankingList'))$('topRankingList').innerHTML=rows.length?rows.map((u,i)=>`<div class="ranking-row ${i<3?`podium-${i+1}`:''}">
      <div class="ranking-position">${i+1}</div>${rankShieldHTML(u.rank)}
      <div class="ranking-player"><strong>${esc(u.fullName||'-')}</strong><small>${esc(u.rank?.tierName||'Bronze')} · Season Rating</small></div>
      <div class="ranking-rating"><strong>${Number(u.rank?.rating||0)}</strong><small>RATING</small></div>
    </div>`).join(''):`<div class="empty-card">ยังไม่มีข้อมูล Ranking</div>`;
  },error=>{console.warn('top ranking:',error)});
}
function startSocialHub(){
  clearInterval(state.presenceTimer);
  syncPublicProfile();writePresence('portal');listenCommunityPlayers();listenTopRanking();
  state.presenceTimer=setInterval(()=>writePresence(document.body.classList.contains('game-active')?'game':'portal'),30000);
}
window.addEventListener('pagehide',()=>markOffline());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')writePresence(document.body.classList.contains('game-active')?'game':'portal')});

/* PVP V2.1 — Auto Room Code + Random Matchmaking */
function renderPvpConfig(){
  if(!state.language){
    setMatchmakingStatus("error","ยังไม่ได้เลือกภาษา","กรุณาเลือก HTML หรือ Python ก่อนเข้า PVP");
    return false;
  }

  if(!state.difficulty) state.difficulty = DIFFICULTIES[0];

  if(!state.lesson){
    state.lesson =
      languageLessons().find(x => x.stage <= maxUnlocked(state.language.id)) ||
      languageLessons()[0];
  }

  return !!state.lesson;
}

function setMatchmakingStatus(type, title, detail=""){
  const box = $("matchmakingStatus");
  if(!box) return;

  box.dataset.state = type || "idle";
  $("matchmakingStatusText").textContent = title;
  $("matchmakingStatusDetail").textContent = detail;
}

function setMatchButtonsBusy(busy){
  const create = $("createRoomButton");
  const find = $("findRoomButton");

  if(create) create.disabled = busy;
  if(find) find.disabled = busy;
}

function systemRoomCode(length=6){
  // ตัด I, O, 0, 1 ออก เพื่อไม่ให้ผู้เล่นอ่านสับสน
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(length);

  if(window.crypto?.getRandomValues){
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, n => chars[n % chars.length]).join("");
  }

  // fallback เฉพาะ Browser เก่ามาก
  let code = "";
  for(let i=0;i<length;i++){
    code += chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

async function createUniqueRoomCode(){
  for(let attempt=0; attempt<15; attempt++){
    const code = systemRoomCode(6);
    const snap = await getDoc(doc(db,"pvp_rooms",code));
    if(!snap.exists()) return code;
  }

  throw new Error("ไม่สามารถสร้าง Room Code ที่ไม่ซ้ำได้ กรุณาลองอีกครั้ง");
}

function playerCount(room){
  return Object.keys(room?.players || {}).length;
}

function isJoinableRoom(room){
  if(!room) return false;
  if(room.status !== "waiting") return false;
  if(room.hostUid === state.uid) return false;
  if(playerCount(room) >= 2) return false;
  const created=room.createdAt?.toDate?.();
  if(created && Date.now()-created.getTime()>10*60*1000) return false;

  // ให้ค้นหาเฉพาะห้องภาษาเดียวกัน เพื่อเริ่มแข่งได้ทันที
  if(state.language?.id && room.languageId !== state.language.id) return false;

  return true;
}

async function leaveCurrentLobby({deleteEmptyHostRoom=true} = {}){
  if(state.roomUnsub){
    state.roomUnsub();
    state.roomUnsub = null;
  }

  const code = state.roomCode;
  const room = state.roomData;

  if(code && room){
    const ref = doc(db,"pvp_rooms",code);

    try{
      if(room.hostUid === state.uid && deleteEmptyHostRoom && room.status === "waiting"){
        // ถ้า Host ออกตอนยังรอ ให้ลบห้อง เพื่อไม่ให้เหลือ Lobby ร้าง
        await deleteDoc(ref);
      } else if(room.status === "waiting" && room.players?.[state.uid]){
        // Challenger ออกจาก Lobby: เอาตัวเองออกจาก players
        await runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          if(!snap.exists()) return;

          const data = snap.data();
          const players = {...(data.players || {})};
          delete players[state.uid];

          tx.update(ref,{players});
        });
      }
    }catch(error){
      console.warn("leaveCurrentLobby:", error);
    }
  }

  state.roomCode = null;
  state.roomData = null;

  $("pvpLobby")?.classList.add("hidden");
  $("startPvpButton")?.classList.add("hidden");
  $("leaveLobbyButton")?.classList.add("hidden");

  setMatchButtonsBusy(false);
  setMatchmakingStatus("idle","พร้อมจับคู่","เลือก “สร้างห้อง” หรือ “ค้นหาห้อง”");
}

$("createRoomButton").onclick = async () => {
  if(!renderPvpConfig()) return;

  setMatchButtonsBusy(true);
  setMatchmakingStatus("searching","กำลังสร้างห้อง...","ระบบกำลังสุ่ม Room Code ที่ไม่ซ้ำ");

  try{
    await leaveCurrentLobby();

    const code = await createUniqueRoomCode();
    state.roomCode = code;

    await setDoc(doc(db,"pvp_rooms",code),{
      code,
      hostUid:state.uid,
      languageId:state.language.id,
      lessonId:state.lesson.id,
      difficultyId:state.lesson.difficulty,
      status:"waiting",
      matchType:"private_auto_code",
      createdAt:serverTimestamp(),
      players:{
        [state.uid]:{
          uid:state.uid,
          name:state.player.fullName,
          studentId:state.player.studentId,
          progress:0,
          finished:false,
          joinedAt:new Date().toISOString()
        }
      }
    });

    setMatchmakingStatus(
      "waiting",
      `สร้างห้อง ${code} แล้ว`,
      "Room Code ถูกสุ่มโดยระบบ กำลังรอผู้เล่นคนที่ 2"
    );

    listenRoom(code);
  }catch(error){
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","สร้างห้องไม่สำเร็จ",error.message || "กรุณาลองใหม่");
  }
};

$("findRoomButton").onclick = async () => {
  if(!renderPvpConfig()) return;

  setMatchButtonsBusy(true);
  setMatchmakingStatus(
    "searching",
    "กำลังค้นหาคู่แข่ง...",
    `ค้นหา Lobby ${state.language.name} ที่กำลังรอผู้เล่น`
  );

  try{
    await leaveCurrentLobby();

    // ดึงห้อง waiting แล้วสุ่มลำดับ เพื่อไม่ให้ทุกคนเข้าห้องแรกเหมือนกัน
    const waitingSnap = await getDocs(
      query(collection(db,"pvp_rooms"), where("status","==","waiting"))
    );

    const candidates = waitingSnap.docs
      .map(d => ({code:d.id, ...d.data()}))
      .filter(isJoinableRoom)
      .sort(() => Math.random() - 0.5);

    if(!candidates.length){
      setMatchButtonsBusy(false);
      setMatchmakingStatus(
        "empty",
        "ยังไม่พบห้องว่าง",
        `ตอนนี้ยังไม่มีผู้เล่น ${state.language.name} ที่กำลังรอ ลองค้นหาอีกครั้งหรือกดสร้างห้อง`
      );
      return;
    }

    let joinedCode = null;

    // ลองทีละห้องด้วย Transaction ป้องกันผู้เล่นหลายคนแย่งช่องเดียวกัน
    for(const candidate of candidates){
      try{
        const ref = doc(db,"pvp_rooms",candidate.code);

        const joined = await runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          if(!snap.exists()) return false;

          const data = snap.data();
          if(!isJoinableRoom(data)) return false;

          const players = {...(data.players || {})};
          players[state.uid] = {
            uid:state.uid,
            name:state.player.fullName,
            studentId:state.player.studentId,
            progress:0,
            finished:false,
            joinedAt:new Date().toISOString()
          };

          tx.update(ref,{
            players,
            matchedAt:serverTimestamp()
          });

          return true;
        });

        if(joined){
          joinedCode = candidate.code;
          break;
        }
      }catch(error){
        console.warn("ข้ามห้องที่ถูกจับคู่ไปแล้ว:", candidate.code, error);
      }
    }

    if(!joinedCode){
      setMatchButtonsBusy(false);
      setMatchmakingStatus(
        "empty",
        "ห้องที่พบถูกจับคู่ไปแล้ว",
        "มีผู้เล่นอื่นเข้าห้องก่อนคุณ กดค้นหาห้องอีกครั้งได้ทันที"
      );
      return;
    }

    state.roomCode = joinedCode;
    setMatchmakingStatus(
      "matched",
      `พบห้อง ${joinedCode}`,
      "เข้าห้องสำเร็จแล้ว รอ Host เริ่มการแข่งขัน"
    );

    listenRoom(joinedCode);
  }catch(error){
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","ค้นหาห้องไม่สำเร็จ",error.message || "กรุณาลองอีกครั้ง");
  }
};

function listenRoom(code){
  if(state.roomUnsub) state.roomUnsub();

  state.roomCode = code;
  $("pvpLobby").classList.remove("hidden");
  $("leaveLobbyButton").classList.remove("hidden");

  state.roomUnsub = onSnapshot(doc(db,"pvp_rooms",code), snap => {
    if(!snap.exists()){
      state.roomCode = null;
      state.roomData = null;
      $("pvpLobby").classList.add("hidden");
      $("startPvpButton").classList.add("hidden");
      $("leaveLobbyButton").classList.add("hidden");
      setMatchButtonsBusy(false);
      setMatchmakingStatus("closed","ห้องถูกปิดแล้ว","สร้างห้องหรือค้นหาห้องใหม่ได้ทันที");
      return;
    }

    state.roomData = snap.data();
    const ps = Object.entries(state.roomData.players || {});

    $("roomCodeLabel").textContent = code;
    $("pvpPlayer1").textContent = ps[0]?.[1]?.name || "รอผู้เล่น...";
    $("pvpPlayer2").textContent = ps[1]?.[1]?.name || "รอผู้เล่น...";
    $("pvpStatus").textContent = String(state.roomData.status || "waiting").toUpperCase();

    const count = ps.length;
    const meIsHost = state.roomData.hostUid === state.uid;

    if(count < 2){
      $("pvpLobbyHint").textContent = "รอผู้เล่นอีก 1 คน";
      setMatchmakingStatus("waiting",`ห้อง ${code} กำลังรอคู่แข่ง`,`มีผู้เล่น ${count}/2 คน`);
    } else if(state.roomData.status === "waiting"){
      $("pvpLobbyHint").textContent = meIsHost ? "ผู้เล่นครบแล้ว กดเริ่มการแข่งขัน" : "ผู้เล่นครบแล้ว รอ Host เริ่ม";
      setMatchmakingStatus("matched","จับคู่สำเร็จแล้ว",meIsHost ? "กดเริ่มการแข่งขันได้เลย" : "กำลังรอ Host เริ่มเกม");
    } else if(state.roomData.status === "playing"){
      $("pvpLobbyHint").textContent = "การแข่งขันกำลังเริ่ม";
      setMatchmakingStatus("playing","เริ่มการแข่งขันแล้ว","กำลังเข้าสู่เกม PVP");
      enterPvpGame(state.roomData,code).catch(error=>console.error("enterPvpGame:",error));
    } else if(state.roomData.status === "finished"){
      $("pvpLobbyHint").textContent = "การแข่งขันจบแล้ว";
      updatePvpRoomProgress(state.roomData);
      handlePvpFinishedRoom(state.roomData).catch(error=>console.error("finish PVP:",error));
    }

    if(state.roomData.status === "playing") updatePvpRoomProgress(state.roomData);

    $("startPvpButton").classList.toggle(
      "hidden",
      !(meIsHost && count === 2 && state.roomData.status === "waiting")
    );

    // เมื่ออยู่ใน Lobby แล้ว ปิดปุ่มสร้าง/ค้นหา ป้องกันสร้างหลายห้องซ้อน
    setMatchButtonsBusy(true);
  }, error => {
    console.error(error);
    setMatchButtonsBusy(false);
    setMatchmakingStatus("error","การเชื่อมต่อ Lobby มีปัญหา",error.message || "");
  });
}

$("startPvpButton").onclick = async () => {
  if(!state.roomCode) return;

  await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
    status:"playing",
    startedAt:serverTimestamp()
  });
};

$("leaveLobbyButton").onclick = async () => {
  await leaveCurrentLobby();
};

$("leavePvpButton").onclick = async () => {
  await forfeitPvpIfPlaying();
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  state.pvpActiveRoom=null;state.pvpLesson=null;state.pvpFinished=false;state.pvpCorrectText="";
  await leaveCurrentLobby({deleteEmptyHostRoom:false});
  showScreen("userPortal");
};

function buildKeyboard(){
  const keyboard=$("keyboard"); if(!keyboard)return;
  keyboard.innerHTML="";
  const rows=[["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],["Space"]];
  const map=new Map();
  rows.forEach(row=>{
    const r=document.createElement("div");r.className="keyboard-row";
    row.forEach(k=>{
      const el=document.createElement("div");el.className="key";el.textContent=k==="Space"?"":k;
      if(["Backspace","Tab","Caps","Enter","Shift"].includes(k))el.classList.add("wide");
      if(k==="Space")el.classList.add("space");
      r.appendChild(el);
      const n=(k==="Space"?" ":k).toLowerCase();if(!map.has(n))map.set(n,[]);map.get(n).push(el);
    });keyboard.appendChild(r);
  });
  const mk=k=>(k==="CapsLock"?"caps":k).toLowerCase();
  window.addEventListener("keydown",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.add("active")));
  window.addEventListener("keyup",e=>(map.get(mk(e.key))||[]).forEach(x=>x.classList.remove("active")));
}


/* ===== V4.3 COMPLETE PVP REALTIME GAME ===== */
function pvpElapsed(){
  if(!state.pvpStartTime)return 0;
  return Math.max(0,(Date.now()-state.pvpStartTime)/1000);
}
function pvpAccuracy(){
  return state.pvpKeys?Math.max(0,(state.pvpCorrectText.length/state.pvpKeys)*100):100;
}
function pvpWpm(){
  const sec=Math.max(pvpElapsed(),0.1);
  return state.pvpCorrectText.length?((state.pvpCorrectText.length/5)/(sec/60)):0;
}
function pvpProgressPct(){
  const code=state.pvpLesson?.code||"";
  return code.length?Math.min(100,(state.pvpCorrectText.length/code.length)*100):0;
}
function renderPvpStrictCode(){
  const code=state.pvpLesson?.code||"";
  let html="";
  for(let i=0;i<code.length;i++){
    const cls=i<state.pvpCorrectText.length?"correct":(i===state.pvpCorrectText.length?"current":"pending");
    const ch=code[i];
    html+=`<span class="${cls}">${ch==="\n"?"\n":ch===" "?" ":esc(ch)}</span>`;
  }
  $("pvpTypingDisplay").innerHTML=html;
  $("pvpTypingDisplay").querySelector(".current")?.scrollIntoView({block:"nearest"});
  const pct=pvpProgressPct();
  $("myPvpBar").style.width=`${pct}%`;
  $("myPvpPct").textContent=`${Math.floor(pct)}%`;
  $("pvpProgress").textContent=`${Math.floor(pct)}%`;
}
function updatePvpStats(){
  $("pvpTime").textContent=fmtTime(pvpElapsed());
  $("pvpWpm").textContent=Math.round(pvpWpm());
  $("pvpAccuracy").textContent=`${pvpAccuracy().toFixed(0)}%`;
  $("pvpMistakes").textContent=state.pvpMistakes;
  $("pvpProgress").textContent=`${Math.floor(pvpProgressPct())}%`;
}
function pvpWrong(expected){
  const stage=$("pvpTypingStage");
  stage.classList.remove("wrong-shake","wrong-flash");
  void stage.offsetWidth;
  stage.classList.add("wrong-shake","wrong-flash");
  $("pvpGameStatus").textContent=`ผิด · ${expected==="\n"?"Enter":expected===" "?"Space":expected}`;
  setTimeout(()=>{stage.classList.remove("wrong-shake","wrong-flash");if(!state.pvpFinished)$("pvpGameStatus").textContent="PLAYING";},260);
}
async function createPvpAttempt(){
  if(state.pvpAttemptId||!state.pvpLesson)return;
  try{
    const r=await addDoc(collection(db,"attempts"),{
      uid:state.uid,studentId:state.player.studentId,fullName:state.player.fullName,
      educationLevel:state.player.educationLevel,classroom:state.player.classroom,department:state.player.department,
      language:state.language?.name||state.pvpLesson.language,languageId:state.pvpLesson.language,
      modeName:"PVP",difficulty:difficultyName(state.pvpLesson.difficulty),difficultyId:state.pvpLesson.difficulty,
      stage:state.pvpLesson.stage,lessonId:state.pvpLesson.id,levelTitle:state.pvpLesson.title,
      roomCode:state.roomCode,status:"playing",score:0,rewardPoints:0,wpm:0,accuracy:0,mistakes:0,
      elapsedSeconds:0,createdAt:serverTimestamp()
    });
    state.pvpAttemptId=r.id;
  }catch(error){console.warn("createPvpAttempt:",error)}
}
async function pushPvpProgress(force=false){
  if(!state.roomCode||!state.roomData||state.pvpFinished)return;
  const now=Date.now();
  if(!force&&now-state.pvpProgressLastSent<160)return;
  state.pvpProgressLastSent=now;
  const pct=Math.round(pvpProgressPct()*10)/10;
  try{
    await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
      [`players.${state.uid}.progress`]:pct,
      [`players.${state.uid}.wpm`]:Math.round(pvpWpm()*100)/100,
      [`players.${state.uid}.accuracy`]:Math.round(pvpAccuracy()*100)/100,
      [`players.${state.uid}.mistakes`]:state.pvpMistakes,
      [`players.${state.uid}.lastUpdateAt`]:serverTimestamp()
    });
  }catch(error){console.warn("PVP progress:",error)}
}
function schedulePvpProgress(){
  clearTimeout(state.pvpProgressTimer);
  state.pvpProgressTimer=setTimeout(()=>pushPvpProgress(false),80);
}
async function savePvpAttempt(result){
  if(state.pvpResultSaved)return;
  state.pvpResultSaved=true;
  if(!state.pvpAttemptId){await createPvpAttempt();}
  if(!state.pvpAttemptId)return;
  try{
    await updateDoc(doc(db,"attempts",state.pvpAttemptId),{
      status:"completed",pvpResult:result,score:result==="win"?100:0,rewardPoints:0,
      wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,
      mistakes:state.pvpMistakes,elapsedSeconds:Math.round(pvpElapsed()*100)/100,
      finishedAt:serverTimestamp()
    });
  }catch(error){console.warn("savePvpAttempt:",error)}
}
async function declarePvpFinish(){
  if(state.pvpFinished||!state.roomCode)return;
  state.pvpFinished=true;
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  $("pvpGameStatus").textContent="FINISHING";
  const ref=doc(db,"pvp_rooms",state.roomCode);
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      if(!snap.exists())return;
      const data=snap.data();
      const players={...(data.players||{})};
      players[state.uid]={...(players[state.uid]||{}),progress:100,finished:true,
        wpm:Math.round(pvpWpm()*100)/100,accuracy:Math.round(pvpAccuracy()*100)/100,
        mistakes:state.pvpMistakes,elapsedSeconds:Math.round(pvpElapsed()*100)/100};
      const winner=data.winnerUid||state.uid;
      tx.update(ref,{players,winnerUid:winner,status:"finished",finishedAt:serverTimestamp()});
    });
  }catch(error){
    console.warn("declarePvpFinish:",error);
    state.pvpFinished=false;
    $("pvpGameStatus").textContent="ERROR";
  }
}
async function handlePvpFinishedRoom(room){
  if(state.pvpActiveRoom!==state.roomCode)return;
  const won=room.winnerUid===state.uid;
  if(!state.pvpFinished){
    state.pvpFinished=true;
    clearInterval(state.pvpTimer);
    clearTimeout(state.pvpProgressTimer);
  }
  $("pvpTypingInput").disabled=true;
  $("pvpGameStatus").textContent=won?"WIN 🏆":"LOSE";
  $("pvpSaveState").textContent=won?"คุณชนะการแข่งขัน · บันทึกผลแล้ว":"คู่แข่งชนะ · บันทึกผลแล้ว";
  await savePvpAttempt(won?"win":"loss");
}
async function enterPvpGame(room,code){
  if(state.pvpActiveRoom===code)return;
  const lesson=LESSONS.find(x=>x.id===room.lessonId);
  if(!lesson){
    setMatchmakingStatus("error","ไม่พบโจทย์ PVP","Room นี้ใช้โจทย์ที่ไม่มีในเวอร์ชันปัจจุบัน");
    return;
  }
  state.pvpActiveRoom=code;
  state.pvpLesson=lesson;
  state.pvpAttemptId=null;
  state.pvpFinished=false;
  state.pvpResultSaved=false;
  state.pvpCorrectText="";
  state.pvpMistakes=0;
  state.pvpKeys=0;
  state.pvpProgressLastSent=0;
  clearInterval(state.pvpTimer);
  clearTimeout(state.pvpProgressTimer);
  $("pvpTypingInput").disabled=false;
  $("pvpTypingInput").value="";

  const startMs=room.startedAt?.toMillis?.()||Date.now();
  state.pvpStartTime=startMs;
  const entries=Object.entries(room.players||{});
  const opponent=entries.find(([id])=>id!==state.uid)?.[1]||null;
  $("pvpChallengeTitle").textContent=`Stage ${lesson.stage} · ${lesson.title}`;
  $("pvpChallengeDescription").textContent=lesson.description||"พิมพ์ Code ให้ครบก่อนคู่แข่ง";
  $("pvpRoomGame").textContent=`Room ${code}`;
  $("pvpOpponentName").textContent=`คู่แข่ง: ${opponent?.name||opponent?.studentId||"-"}`;
  $("myPvpName").textContent=state.player.fullName||state.player.studentId;
  $("oppPvpName").textContent=opponent?.name||opponent?.studentId||"OPPONENT";
  $("myPvpBar").style.width="0%";$("oppPvpBar").style.width=`${Number(opponent?.progress||0)}%`;
  $("myPvpPct").textContent="0%";$("oppPvpPct").textContent=`${Math.floor(Number(opponent?.progress||0))}%`;
  $("pvpGameStatus").textContent="PLAYING";
  $("pvpSaveState").textContent="Realtime · Strict Typing";
  renderPvpStrictCode();updatePvpStats();
  showScreen("pvpGameScreen");
  await createPvpAttempt();
  state.pvpTimer=setInterval(updatePvpStats,100);
  setTimeout(()=>$("pvpTypingInput").focus({preventScroll:true}),100);
}
function updatePvpRoomProgress(room){
  if(state.pvpActiveRoom!==state.roomCode)return;
  const players=room.players||{};
  const mine=players[state.uid]||{};
  const oppEntry=Object.entries(players).find(([id])=>id!==state.uid);
  const opp=oppEntry?.[1]||{};
  const myPct=Math.max(Number(mine.progress||0),pvpProgressPct());
  const oppPct=Number(opp.progress||0);
  $("myPvpBar").style.width=`${Math.min(100,myPct)}%`;
  $("myPvpPct").textContent=`${Math.floor(myPct)}%`;
  $("oppPvpBar").style.width=`${Math.min(100,oppPct)}%`;
  $("oppPvpPct").textContent=`${Math.floor(oppPct)}%`;
}
$("pvpTypingStage").onclick=()=>$("pvpTypingInput").focus({preventScroll:true});
$("pvpTypingInput").addEventListener("keydown",async e=>{
  if(state.pvpFinished){e.preventDefault();return;}
  if(["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
    e.preventDefault();$("pvpGameStatus").textContent="STRICT · พิมพ์ตัวเดิมใหม่";return;
  }
  const raw=keyToInput(e);
  if(raw===null)return;
  e.preventDefault();
  const code=state.pvpLesson?.code||"";
  const pos=state.pvpCorrectText.length;
  const expected=code[pos];
  if(expected===undefined)return;
  state.pvpKeys++;
  if(raw==="\t"){
    if(expected===" "){
      let count=0;while(code[pos+count]===" "&&count<4)count++;
      state.pvpCorrectText+=code.slice(pos,pos+count);
      renderPvpStrictCode();updatePvpStats();schedulePvpProgress();
      if(state.pvpCorrectText===code)await declarePvpFinish();
    }else{state.pvpMistakes++;pvpWrong(expected);updatePvpStats();schedulePvpProgress();}
    return;
  }
  if(raw===expected){
    state.pvpCorrectText+=raw;renderPvpStrictCode();updatePvpStats();schedulePvpProgress();
    $("pvpGameStatus").textContent="PLAYING";
    if(state.pvpCorrectText===code)await declarePvpFinish();
  }else{
    state.pvpMistakes++;pvpWrong(expected);updatePvpStats();schedulePvpProgress();
  }
});
async function forfeitPvpIfPlaying(){
  if(!state.roomCode||state.roomData?.status!=="playing"||state.pvpFinished)return;
  const opponentUid=Object.keys(state.roomData.players||{}).find(id=>id!==state.uid);
  if(!opponentUid)return;
  state.pvpFinished=true;clearInterval(state.pvpTimer);clearTimeout(state.pvpProgressTimer);
  try{
    await updateDoc(doc(db,"pvp_rooms",state.roomCode),{
      winnerUid:opponentUid,status:"finished",finishedAt:serverTimestamp(),forfeitUid:state.uid
    });
    await savePvpAttempt("forfeit");
  }catch(error){console.warn("forfeit:",error)}
}


/* ===== Responsive Device UX ===== */
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function isPhoneLayout() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function isMobileOrTabletDevice() {
  const ua = navigator.userAgent || "";
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua);
  const iPadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const coarseTablet = window.matchMedia("(pointer: coarse)").matches
    && Math.min(screen.width || innerWidth, screen.height || innerHeight) <= 1024;
  return mobileUa || iPadDesktopMode || coarseTablet;
}

function isZoneOnlyDevice() {
  return isMobileOrTabletDevice();
}

function applyZoneOnlyPortalMode() {
  const zoneOnly = isZoneOnlyDevice();
  document.documentElement.classList.toggle("zone-only-device", zoneOnly);
  document.body?.classList.toggle("zone-only-device", zoneOnly);

  const notice = $("mobileZoneOnlyNotice");
  if (notice) notice.classList.toggle("hidden", !zoneOnly);

  const zoneOnlyButton = $("mobileZoneOnlyEnter");
  if (zoneOnlyButton) zoneOnlyButton.setAttribute("href", "zone.html");

  const headTitle = document.querySelector("#userPortal .user-portal-head h2");
  if (headTitle && zoneOnly) headTitle.textContent = "เข้าใช้งาน 2D Zone";
  if (headTitle && !zoneOnly) headTitle.textContent = "เลือกภาษาและโหมดการเรียนรู้";
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

function updateDeviceUX() {
  const hint = $("deviceHint");
  if (!hint) return;

  const touch = isTouchDevice();
  const phone = isPhoneLayout();
  const zoneOnly = isZoneOnlyDevice();

  document.documentElement.classList.toggle("touch-device", touch);
  document.documentElement.classList.toggle("phone-layout", phone);
  document.documentElement.classList.toggle("landscape-layout", isLandscape());

  if (zoneOnly) {
    hint.textContent = phone ? (isLandscape() ? "มือถือ · เข้า 2D Zone เท่านั้น" : "มือถือ · เข้า 2D Zone เท่านั้น") : "แท็บเล็ต · เข้า 2D Zone เท่านั้น";
  } else if (phone) {
    hint.textContent = isLandscape() ? "มือถือ · แนวนอน" : "มือถือ · แนวตั้ง";
  } else if (touch) {
    hint.textContent = "Tablet / Touch";
  } else {
    hint.textContent = "Desktop";
  }

  applyZoneOnlyPortalMode();
}

function syncMobileStats() {
  const map = [
    ["mobileStatLevel", "statLevel"],
    ["mobileStatTime", "statTime"],
    ["mobileStatWpm", "statWpm"],
    ["mobileStatAccuracy", "statAccuracy"],
    ["mobileStatMistakes", "statMistakes"],
    ["mobileStatToken", "statScore"]
  ];
  map.forEach(([mobileId, sourceId]) => {
    const mobile = $(mobileId);
    const source = $(sourceId);
    if (mobile && source) mobile.textContent = source.textContent;
  });
}

window.addEventListener("resize", updateDeviceUX);
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    updateDeviceUX();
    $("typingInput")?.focus({preventScroll:true});
  }, 250);
});

if ($("mobileFocusButton")) {
  $("mobileFocusButton").onclick = () => {
    $("typingInput")?.focus({preventScroll:true});
    $("typingStage")?.scrollIntoView({block:"nearest"});
  };
}

if ($("mobileStatsButton")) {
  $("mobileStatsButton").onclick = () => {
    syncMobileStats();
    $("mobileStatsSheet")?.classList.remove("hidden");
  };
}

if ($("closeMobileStats")) {
  $("closeMobileStats").onclick = () => {
    $("mobileStatsSheet")?.classList.add("hidden");
    $("typingInput")?.focus({preventScroll:true});
  };
}

if ($("mobileStatsSheet")) {
  $("mobileStatsSheet").addEventListener("click", (e) => {
    if (e.target === $("mobileStatsSheet")) {
      $("mobileStatsSheet").classList.add("hidden");
      $("typingInput")?.focus({preventScroll:true});
    }
  });
}

if ($("mobileExitButton")) {
  $("mobileExitButton").onclick = () => $("quitButton")?.click();
}

updateDeviceUX();

onAuthStateChanged(auth,async user=>{
  if(!user){state.uid=null;state.player=null;showScreen("authScreen");return;}
  if(user.email==="pisit_2000@thc-nr.local"){location.replace("./admin.html?v=4.3.0");return;}
  state.uid=user.uid;
  try{
    await routeAuthenticatedStudent();
  }catch(error){
    console.error("auth route:",error);
    showScreen("authScreen");
    $("loginMessage").textContent="เปิดบัญชีไม่สำเร็จ กรุณา Reload แล้วลองใหม่";
  }
});

buildKeyboard();
updateRegister();

```

---

## admin.js

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc,
  writeBatch, serverTimestamp, onSnapshot, Timestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_UID } from "./firebase-config.js?v=4.3.0";
import { DEFAULT_MODES, DEFAULT_LEVELS } from "./default-data.js?v=4.3.0";
import { seasonIdFromDate, seasonRange, calculateRankMetrics } from "./ranking-system.js?v=4.3.0";

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);
let cache={users:[],attempts:[],levels:[],modes:[],official:[],zonePositions:[],zoneModeration:[],zoneMessages:[],zoneArchive:[]},unsubs=[];
let knownUserIds=null;

const isAdmin=user=>!!user&&user.uid===ADMIN_UID;
const dateValue=v=>{try{return v?.toDate?.()?.getTime?.()||0}catch{return 0}};
const formatDate=v=>{try{return v?.toDate?.().toLocaleString("th-TH")||"-"}catch{return "-"}};
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

function showAdminToast(title,message="",isError=false){
  const box=$("adminToast");if(!box)return;
  box.classList.remove("hidden","error");if(isError)box.classList.add("error");
  box.innerHTML=`<strong>${esc(title)}</strong><span>${esc(message)}</span>`;
  clearTimeout(showAdminToast.timer);
  showAdminToast.timer=setTimeout(()=>box.classList.add("hidden"),4500);
}

$("adminLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();$("adminLoginError").textContent="";
  try{
    if($("adminUsername").value.trim()!==ADMIN_USERNAME)throw new Error("Username ไม่ถูกต้อง");
    const r=await signInWithEmailAndPassword(auth,ADMIN_EMAIL,$("adminPassword").value);
    if(!isAdmin(r.user)){await signOut(auth);throw new Error("บัญชีนี้ไม่ใช่ Admin")}
  }catch(err){$("adminLoginError").textContent="เข้าสู่ระบบไม่สำเร็จ: "+err.message}
});
$("logoutAdmin").onclick=()=>signOut(auth);

onAuthStateChanged(auth,user=>{
  const ok=isAdmin(user);$("adminLogin").classList.toggle("hidden",ok);$("adminDashboard").classList.toggle("hidden",!ok);
  unsubs.forEach(fn=>fn());unsubs=[];
  if(ok)startRealtime();
});

function startRealtime(){
  unsubs.push(onSnapshot(collection(db,"users"),snap=>{
    const next=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));
    const nextIds=new Set(next.map(x=>x.id));
    if(knownUserIds){next.filter(x=>!knownUserIds.has(x.id)).forEach(x=>showAdminToast(`สมาชิกใหม่ ${x.studentId||""}`,x.fullName||"ลงทะเบียนเรียบร้อย"));}
    knownUserIds=nextIds;cache.users=next;renderAll();
  },error=>showAdminToast("Users Realtime ขัดข้อง",error.message||String(error),true)));
  unsubs.push(onSnapshot(collection(db,"attempts"),snap=>{cache.attempts=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"levels"),snap=>{cache.levels=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.levelNo)-Number(b.levelNo));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"game_modes"),snap=>{cache.modes=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"official_submissions"),snap=>{cache.official=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>dateValue(b.submittedAt)-dateValue(a.submittedAt));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_positions"),snap=>{cache.zonePositions=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  unsubs.push(onSnapshot(collection(db,"zone_moderation"),snap=>{cache.zoneModeration=snap.docs.map(d=>({id:d.id,...d.data()}));renderAll()}));
  const chatQuery=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(500));
  unsubs.push(onSnapshot(chatQuery,snap=>{cache.zoneMessages=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.zoneId===ACTIVE_ZONE_ID);renderAll()},error=>console.warn("live zone chat:",error)));
  const archiveQuery=query(collection(db,"zone_chat_archive"),orderBy("createdAt","desc"),limit(1000));
  unsubs.push(onSnapshot(archiveQuery,snap=>{cache.zoneArchive=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.zoneId===ACTIVE_ZONE_ID);renderAll()},error=>{cache.zoneArchive=[];console.warn("zone archive:",error)}));
}
function renderAll(){renderMetrics();renderResults();renderUsers();renderLevels();renderOfficial();renderRanking();renderZoneControl();renderZoneChatLog()}
function renderMetrics(){
  const completed=cache.attempts.filter(x=>x.status==="completed");
  const avg=completed.length?Math.round(completed.reduce((s,x)=>s+Number(x.score||0),0)/completed.length):0;
  $("metricLevels").textContent=cache.levels.length;$("metricUsers").textContent=cache.users.length;
  $("metricCompleted").textContent=completed.length;$("metricAverage").textContent=avg.toLocaleString();
}
function renderResults(){
  $("resultsBody").innerHTML=cache.attempts.map(x=>{
    const stage=x.stage??x.levelNo??"-";
    const mode=x.modeName||x.mode||"-";
    const pvp=x.pvpResult?` · ${String(x.pvpResult).toUpperCase()}`:"";
    return `<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department)}</td><td>${esc(mode)}${esc(pvp)}</td><td>${esc(stage)}</td><td><span class="status status-${esc(x.status)}">${esc(x.status)}</span></td><td><strong>${Number(x.score||0).toLocaleString()}</strong></td><td>${esc(x.wpm??0)}</td><td>${esc(x.accuracy??0)}%</td><td><button class="mini-delete" data-delete-attempt="${x.id}">ลบ</button></td></tr>`;
  }).join("")||`<tr><td colspan="12" class="empty">ยังไม่มีผลการเล่น</td></tr>`;
  document.querySelectorAll("[data-delete-attempt]").forEach(b=>b.onclick=async()=>{if(confirm("ลบผลรายการนี้?"))await deleteDoc(doc(db,"attempts",b.dataset.deleteAttempt))});
}
function renderUsers(){
  $("usersBody").innerHTML=cache.users.map(x=>`<tr><td>${formatDate(x.createdAt)}</td><td>${esc(x.studentId)}</td><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td><td>${esc(x.department)}</td><td><strong>${Number(x.tokenBalance||0).toLocaleString()}</strong></td><td><span class="status status-active">${esc(x.status||"active")}</span></td><td><button class="mini-delete" data-delete-user="${x.id}">ลบข้อมูล</button></td></tr>`).join("")||`<tr><td colspan="8" class="empty">ยังไม่มีสมาชิก</td></tr>`;
  document.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=async()=>{if(confirm("ลบข้อมูลสมาชิกจาก Firestore? หมายเหตุ: บัญชี Authentication ต้องลบใน Firebase Console แยกต่างหาก"))await deleteDoc(doc(db,"users",b.dataset.deleteUser))});
}
function renderLevels(){
  $("levelCards").innerHTML=cache.levels.map(x=>`<article class="level-admin-card"><div><span>LEVEL ${esc(x.levelNo)}</span><h3>${esc(x.title)}</h3><p>${esc(x.language)} · ${esc(x.difficulty)} · ${esc(x.basePoints)} pts</p></div><div class="button-row"><button class="btn ghost btn-small" data-edit-level="${x.id}">แก้ไข</button><button class="btn danger btn-small" data-delete-level="${x.id}">ลบ</button></div></article>`).join("");
  document.querySelectorAll("[data-edit-level]").forEach(b=>b.onclick=()=>{const x=cache.levels.find(l=>l.id===b.dataset.editLevel);if(!x)return;$("editLevelNo").value=x.levelNo;$("editTitle").value=x.title;$("editLanguage").value=x.language;$("editDifficulty").value=x.difficulty;$("editBasePoints").value=x.basePoints;$("editTimeLimit").value=x.timeLimit;$("editMultiplier").value=x.difficultyMultiplier;$("editDescription").value=x.description||"";$("editCode").value=x.code;window.scrollTo({top:$("levelForm").offsetTop-30,behavior:"smooth"})});
  document.querySelectorAll("[data-delete-level]").forEach(b=>b.onclick=async()=>{if(confirm("ลบโจทย์นี้?"))await deleteDoc(doc(db,"levels",b.dataset.deleteLevel))});
}

function renderOfficial(){
  if(!$("officialBody"))return;
  $("officialBody").innerHTML=cache.official.map(x=>`<tr>
    <td>${formatDate(x.submittedAt)}</td>
    <td>${esc(x.studentId)}</td>
    <td><strong>${esc(x.fullName)}</strong></td>
    <td>${esc(x.educationLevel||"")}${esc(x.classroom||"")}</td>
    <td>${esc(x.department)}</td>
    <td>${esc(x.completedStages||0)}/30</td>
    <td><strong>${Number(x.totalScore||0).toFixed(2)} / ${Number(x.maxScore||40)}</strong></td>
    <td>${Number(x.avgAccuracy||0).toFixed(1)}%</td>
    <td>${Number(x.avgWpm||0).toFixed(1)}</td>
  </tr>`).join("")||`<tr><td colspan="9" class="empty">ยังไม่มีผู้ส่งงานทางการ</td></tr>`;
}

function seasonAttemptsForUser(uid){
  const range=seasonRange(new Date());
  return cache.attempts.filter(a=>{
    if(a.uid!==uid || a.status!=="completed")return false;
    const dt=a.createdAt?.toDate?.();
    return !!dt && dt>=range.start && dt<=range.end;
  });
}

function renderRanking(){
  if(!$("rankingBody"))return;
  const seasonId=seasonIdFromDate(new Date()),range=seasonRange(new Date());
  $("adminSeasonId").textContent=seasonId;
  $("adminSeasonRange").textContent=`${range.start.toLocaleDateString("th-TH")} – ${range.end.toLocaleDateString("th-TH")}`;

  const rows=cache.users.map(u=>{
    const attempts=seasonAttemptsForUser(u.id);
    const days=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
    const m=calculateRankMetrics(attempts,days);
    return {user:u,...m};
  }).sort((a,b)=>b.rating-a.rating);

  $("rankingBody").innerHTML=rows.map((r,i)=>`<tr>
    <td><strong>${i+1}</strong></td>
    <td>${esc(r.user.fullName)}<br><small>${esc(r.user.studentId)}</small></td>
    <td><strong>${r.tierIcon} ${r.tierName}</strong></td>
    <td>${r.rating}</td>
    <td>${r.diligence}</td>
    <td>${r.accuracy}</td>
    <td>${r.speed}</td>
    <td>${r.consistency}</td>
    <td>${r.avgWpm}</td>
  </tr>`).join("")||`<tr><td colspan="9" class="empty">ยังไม่มีข้อมูล Ranking</td></tr>`;
}

async function persistRanking(){
  const seasonId=seasonIdFromDate(new Date());
  for(const u of cache.users){
    const attempts=seasonAttemptsForUser(u.id);
    const days=new Set(attempts.map(a=>a.createdAt?.toDate?.()?.toISOString().slice(0,10)).filter(Boolean)).size;
    const m=calculateRankMetrics(attempts,days);
    await setDoc(doc(db,"rankings",`${seasonId}_${u.id}`),{
      seasonId,uid:u.id,studentId:u.studentId,fullName:u.fullName,...m,updatedAt:serverTimestamp()
    },{merge:true});
    await setDoc(doc(db,"users",u.id),{
      rank:{seasonId,...m,updatedAt:new Date().toISOString()}
    },{merge:true});
  }
}

if($("recalculateRanking"))$("recalculateRanking").onclick=async()=>{
  await persistRanking();
  alert("คำนวณ Ranking Season ปัจจุบันเรียบร้อย");
};

if($("exportOfficialCsv"))$("exportOfficialCsv").onclick=()=>{
  const h=["submitted_at","student_id","name","class","department","completed","score","max_score","accuracy","wpm"];
  const q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const rows=cache.official.map(x=>[
    formatDate(x.submittedAt),x.studentId,x.fullName,
    `${x.educationLevel||""}${x.classroom||""}`,x.department,
    x.completedStages,x.totalScore,x.maxScore,x.avgAccuracy,x.avgWpm
  ].map(q).join(","));
  downloadFile("official_scores.csv","\ufeff"+h.join(",")+"\n"+rows.join("\n"),"text/csv;charset=utf-8");
};


const ZONE_ONLINE_STALE_MS=95000;
const ACTIVE_ZONE_ID="thai_social_zone_v4_1";

function zonePositionOnline(p){
  if(!p?.online || p.zoneId!==ACTIVE_ZONE_ID)return false;
  const dt=p.updatedAt?.toDate?.();
  return !dt || Date.now()-dt.getTime()<=ZONE_ONLINE_STALE_MS;
}

function activeZoneBan(m){
  const until=m?.bannedUntil?.toDate?.();
  return !!until && until.getTime()>Date.now();
}

function moderationFor(uid){
  return cache.zoneModeration.find(x=>x.id===uid)||null;
}

function zonePositionFor(uid){
  return cache.zonePositions.find(x=>x.id===uid)||null;
}

function banUntilText(m){
  if(!activeZoneBan(m))return "-";
  return m.bannedUntil.toDate().toLocaleString("th-TH");
}

function durationMs(value,unit){
  const n=Math.max(1,Number(value)||1);
  if(unit==="hour")return n*60*60*1000;
  if(unit==="day")return n*24*60*60*1000;
  return n*60*1000;
}

function renderZoneControl(){
  if(!$("zoneControlBody"))return;

  const onlineCount=cache.users.filter(u=>zonePositionOnline(zonePositionFor(u.id))).length;
  const bannedCount=cache.users.filter(u=>activeZoneBan(moderationFor(u.id))).length;
  $("zoneOnlineMetric").textContent=onlineCount;
  $("zoneBannedMetric").textContent=bannedCount;

  const rows=[...cache.users].sort((a,b)=>{
    const ao=zonePositionOnline(zonePositionFor(a.id));
    const bo=zonePositionOnline(zonePositionFor(b.id));
    if(ao!==bo)return bo-ao;
    const ab=activeZoneBan(moderationFor(a.id));
    const bb=activeZoneBan(moderationFor(b.id));
    if(ab!==bb)return bb-ab;
    return String(a.studentId||"").localeCompare(String(b.studentId||""));
  });

  $("zoneControlBody").innerHTML=rows.map(u=>{
    const pos=zonePositionFor(u.id);
    const mod=moderationFor(u.id);
    const online=zonePositionOnline(pos);
    const banned=activeZoneBan(mod);

    return `<tr class="${banned?"zone-row-banned":online?"zone-row-online":""}">
      <td><strong>${esc(u.studentId||"-")}</strong></td>
      <td>${esc(u.fullName||"-")}</td>
      <td>${esc(u.rank?.tierName||"Bronze")} · ${Number(u.rank?.rating||0)}</td>
      <td><span class="zone-admin-status ${banned?"banned":online?"online":"offline"}">${banned?"BANNED":online?"ONLINE":"OFFLINE"}</span></td>
      <td>${formatDate(pos?.updatedAt)}</td>
      <td>${banUntilText(mod)}</td>
      <td><input class="zone-ban-reason" data-ban-reason="${u.id}" value="${esc(mod?.banReason||"")}" placeholder="เหตุผล (ไม่บังคับ)"></td>
      <td>
        <div class="zone-ban-duration">
          <input data-ban-value="${u.id}" type="number" min="1" max="365" value="30">
          <select data-ban-unit="${u.id}">
            <option value="minute">นาที</option>
            <option value="hour">ชั่วโมง</option>
            <option value="day">วัน</option>
          </select>
        </div>
      </td>
      <td>
        <div class="zone-admin-actions">
          <button class="btn zone-kick-btn" data-zone-kick="${u.id}" ${online&&!banned?"":"disabled"}>เตะ</button>
          <button class="btn danger" data-zone-ban="${u.id}">${banned?"ต่อเวลาแบน":"แบน"}</button>
          <button class="btn ghost" data-zone-unban="${u.id}" ${banned?"":"disabled"}>ปลดแบน</button>
        </div>
      </td>
    </tr>`;
  }).join("")||`<tr><td colspan="9" class="empty">ยังไม่มี User</td></tr>`;

  document.querySelectorAll("[data-zone-kick]").forEach(btn=>{
    btn.onclick=()=>kickZoneUser(btn.dataset.zoneKick);
  });
  document.querySelectorAll("[data-zone-ban]").forEach(btn=>{
    btn.onclick=()=>banZoneUser(btn.dataset.zoneBan);
  });
  document.querySelectorAll("[data-zone-unban]").forEach(btn=>{
    btn.onclick=()=>unbanZoneUser(btn.dataset.zoneUnban);
  });
}

async function setZoneOffline(uid){
  try{
    await setDoc(doc(db,"zone_positions",uid),{
      zoneId:"thai_social_zone_v4_1",
      online:false,
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("setZoneOffline:",error)}
}

async function kickZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;
  const reason=$(`[data-ban-reason="${uid}"]`)?.value?.trim()||"GM เตะออกจาก 2D Zone";

  if(!confirm(`เตะ ${user.studentId} ออกจาก 2D Zone?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    uid,
    studentId:user.studentId||"",
    kickedUntil:Timestamp.fromMillis(Date.now()+15000),
    kickReason:reason,
    kickedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});

  await setZoneOffline(uid);
}

async function banZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;

  const value=$(`[data-ban-value="${uid}"]`)?.value||30;
  const unit=$(`[data-ban-unit="${uid}"]`)?.value||"minute";
  const reason=$(`[data-ban-reason="${uid}"]`)?.value?.trim()||"ระงับการเข้าใช้งาน 2D Zone โดย GM";
  const ms=durationMs(value,unit);
  const until=new Date(Date.now()+ms);

  if(!confirm(`แบน ${user.studentId} ถึง ${until.toLocaleString("th-TH")} ?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    uid,
    studentId:user.studentId||"",
    bannedUntil:Timestamp.fromMillis(until.getTime()),
    banReason:reason,
    bannedAt:serverTimestamp(),
    kickedUntil:Timestamp.fromMillis(Date.now()+15000),
    updatedAt:serverTimestamp()
  },{merge:true});

  await setZoneOffline(uid);
}

async function unbanZoneUser(uid){
  const user=cache.users.find(x=>x.id===uid);
  if(!user)return;
  if(!confirm(`ปลดแบน ${user.studentId} ?`))return;

  await setDoc(doc(db,"zone_moderation",uid),{
    bannedUntil:Timestamp.fromMillis(0),
    banReason:"",
    unbannedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});
}


const USER_ZONE_CHAT_TTL_MS=24*60*60*1000;
function zoneChatIsGM(m){return m?.isGM===true || m?.uid===ADMIN_UID}
function zoneChatVisible(m,now=Date.now()){
  if(zoneChatIsGM(m))return true;
  const created=m?.createdAt?.toDate?.();
  return !!created && (now-created.getTime())<USER_ZONE_CHAT_TTL_MS;
}
function zoneChatExpired(m,now=Date.now()){
  if(zoneChatIsGM(m))return false;
  const created=m?.createdAt?.toDate?.();
  return !!created && (now-created.getTime())>=USER_ZONE_CHAT_TTL_MS;
}
function zoneChatUserName(m){
  if(zoneChatIsGM(m))return "Game Master";
  return cache.users.find(u=>u.id===m.uid)?.fullName||"-";
}
function zoneChatExpiryLabel(m){
  if(zoneChatIsGM(m))return "ถาวร";
  const created=m?.createdAt?.toDate?.();
  const until=created?created.getTime()+USER_ZONE_CHAT_TTL_MS:Date.now();
  const left=Math.max(0,until-Date.now()),h=Math.floor(left/3600000),min=Math.floor((left%3600000)/60000);
  return left>0?`${h}ชม. ${min}น.`:"หมดอายุ";
}
function combinedZoneChatArchive(){
  const map=new Map();
  cache.zoneMessages.forEach(m=>map.set(m.id,m));
  cache.zoneArchive.forEach(m=>map.set(m.messageId||m.id,m));
  return [...map.values()].sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));
}

function renderZoneChatLog(){
  if(!$("zoneChatAdminList"))return;
  const rows=combinedZoneChatArchive();
  const user24=rows.filter(m=>!zoneChatIsGM(m)&&zoneChatVisible(m)).length;
  const gmCount=rows.filter(zoneChatIsGM).length;
  $("zoneChat24hMetric").textContent=user24;
  $("zoneChatGmMetric").textContent=gmCount;
  $("zoneChatTotalMetric").textContent=rows.length;
  $("zoneChatAdminList").innerHTML=rows.length?rows.map(m=>{
    const gm=zoneChatIsGM(m),dt=m.createdAt?.toDate?.(),expired=!gm&&!zoneChatVisible(m);
    return `<article class="admin-zone-chat-message ${gm?"gm":expired?"expired":"user"}">
      <div class="admin-zone-chat-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div>
      <div class="admin-zone-chat-content">
        <div class="admin-zone-chat-meta"><strong>${gm?"GM":esc(m.studentId||"USER")}</strong><span>${esc(zoneChatUserName(m))}</span><time>${dt?dt.toLocaleString("th-TH"):"-"}</time></div>
        <p>${esc(m.text||"")}</p>
        <small>${gm?"ประกาศ GM · ถาวร":expired?"หมดอายุจากหน้า User แล้ว · เก็บใน Admin Archive":`ข้อความ User · เหลือ ${zoneChatExpiryLabel(m)}`}</small>
      </div>
      <button class="btn danger btn-small" data-delete-zone-message="${esc(m.messageId||m.id)}">ลบ Log</button>
    </article>`;
  }).join(""):`<div class="empty">ยังไม่มีประวัติแชต</div>`;
  document.querySelectorAll("[data-delete-zone-message]").forEach(btn=>btn.onclick=async()=>{
    if(!confirm("ลบข้อความและ Archive รายการนี้?"))return;
    const id=btn.dataset.deleteZoneMessage,batch=writeBatch(db);
    batch.delete(doc(db,"zone_messages",id));batch.delete(doc(db,"zone_chat_archive",id));
    try{await batch.commit()}catch(error){console.warn("delete chat log:",error)}
  });
}

async function cleanupExpiredZoneMessages(showAlert=true){
  const expired=cache.zoneMessages.filter(zoneChatExpired);
  if(!expired.length){if(showAlert)alert("ไม่มี User Chat ที่หมดอายุ");return 0}
  let batch=writeBatch(db),count=0,total=0;
  for(const m of expired){batch.delete(doc(db,"zone_messages",m.id));count++;total++;if(count>=400){await batch.commit();batch=writeBatch(db);count=0}}
  if(count)await batch.commit();if(showAlert)alert(`ล้างข้อความหมดอายุ ${total} รายการแล้ว`);return total;
}
if($("cleanupExpiredZoneChat"))$("cleanupExpiredZoneChat").onclick=()=>cleanupExpiredZoneMessages(true);
if($("exportZoneChatCsv"))$("exportZoneChatCsv").onclick=()=>{
  const rows=combinedZoneChatArchive(),q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const data=[["date","type","student_id","name","message","expires"].join(","),...rows.map(m=>[
    formatDate(m.createdAt),zoneChatIsGM(m)?"GM":"USER",zoneChatIsGM(m)?"GM":m.studentId,zoneChatUserName(m),m.text,zoneChatIsGM(m)?"PERMANENT":(zoneChatVisible(m)?zoneChatExpiryLabel(m):"EXPIRED_ARCHIVED")
  ].map(q).join(","))].join("\n");
  downloadText(`zone_chat_${new Date().toISOString().slice(0,10)}.csv`,"\ufeff"+data,"text/csv;charset=utf-8");
};

$("levelForm").addEventListener("submit",async e=>{e.preventDefault();const n=Number($("editLevelNo").value),id=`level_${String(n).padStart(2,"0")}`;await setDoc(doc(db,"levels",id),{levelNo:n,title:$("editTitle").value.trim(),language:$("editLanguage").value.trim(),difficulty:$("editDifficulty").value,basePoints:Number($("editBasePoints").value),timeLimit:Number($("editTimeLimit").value),difficultyMultiplier:Number($("editMultiplier").value),description:$("editDescription").value.trim(),code:$("editCode").value,isActive:true,updatedAt:serverTimestamp()},{merge:true});e.target.reset();$("editBasePoints").value=100;$("editTimeLimit").value=90;$("editMultiplier").value=1});
$("seedDefaults").onclick=async()=>{if(!confirm("คืนค่า 4 โหมดและ 12 Level เริ่มต้น?"))return;const batch=writeBatch(db);DEFAULT_MODES.forEach(x=>{const {id,...data}=x;batch.set(doc(db,"game_modes",id),{...data,id,isActive:true},{merge:true})});DEFAULT_LEVELS.forEach(x=>batch.set(doc(db,"levels",`level_${String(x.levelNo).padStart(2,"0")}`),{...x,isActive:true},{merge:true}));await batch.commit()};
async function deleteCollectionDocs(name){const rows=await getDocs(collection(db,name));let batch=writeBatch(db),count=0;for(const item of rows.docs){batch.delete(item.ref);if(++count>=450){await batch.commit();batch=writeBatch(db);count=0}}if(count)await batch.commit()}
$("deleteResults").onclick=async()=>{if(confirm("ยืนยันลบผลทั้งหมด?"))await deleteCollectionDocs("attempts")};
$("deleteUsers").onclick=async()=>{if(confirm("ยืนยันลบข้อมูลสมาชิกทั้งหมดจาก Firestore? บัญชี Authentication จะไม่ถูกลบ"))await deleteCollectionDocs("users")};
function downloadFile(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
$("exportCsv").onclick=()=>{const h=["date","student_id","name","level","classroom","department","mode","game_level","status","score","wpm","accuracy","mistakes","time_seconds"],q=v=>`"${String(v??"").replaceAll('"','""')}"`,rows=cache.attempts.map(x=>[formatDate(x.createdAt),x.studentId,x.fullName,x.educationLevel,x.classroom,x.department,x.modeName,(x.stage??x.levelNo),x.status,x.score,x.wpm,x.accuracy,x.mistakes,x.elapsedSeconds].map(q).join(","));downloadFile("code_typing_results.csv","\ufeff"+h.join(",")+"\n"+rows.join("\n"),"text/csv;charset=utf-8")};
$("exportJson").onclick=()=>downloadFile("code_typing_backup.json",JSON.stringify({
  exportedAt:new Date().toISOString(),game_modes:cache.modes,levels:cache.levels,users:cache.users,attempts:cache.attempts,
  official_submissions:cache.official,zone_moderation:cache.zoneModeration,zone_chat_archive:combinedZoneChatArchive()
},(k,v)=>v?.toDate?.()?v.toDate().toISOString():v,2),"application/json");
$("importJson").addEventListener("change",async e=>{const f=e.target.files[0];if(!f||!confirm("นำเข้าข้อมูล JSON?"))return;const data=JSON.parse(await f.text());for(const [name,rows] of Object.entries({
  game_modes:data.game_modes||[],levels:data.levels||[],users:data.users||[],attempts:data.attempts||[],
  official_submissions:data.official_submissions||[],zone_moderation:data.zone_moderation||[],zone_chat_archive:data.zone_chat_archive||[]
})){for(const row of rows){const id=row.id||doc(collection(db,name)).id,copy={...row};delete copy.id;await setDoc(doc(db,name,id),copy,{merge:true})}}alert("นำเข้าสำเร็จ")});
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".admin-tab-panel").forEach(x=>x.classList.add("hidden"));btn.classList.add("active");$(btn.dataset.tab).classList.remove("hidden")});

```

---

## zone.js

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc,
  collection, onSnapshot, serverTimestamp, query, orderBy, limit, where,
  runTransaction, Timestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js?v=4.3.0";
import { REWARD_ITEMS, RARITY_META } from "./reward-data.js?v=4.3.0";
import { DEFAULT_CHARACTER } from "./character-system.js?v=4.3.0";

window.__ZONE_V43_BOOTED__ = true;

const firebaseApp=initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);
const $=id=>document.getElementById(id);

const ZONE_VERSION="4.3.0";
const ZONE_ID="thai_social_zone_v4_1";
const WORLD={width:3000,height:900};
const WALK_Y=700;
const PLAYER_SPEED=250;
const POSITION_SEND_MS=260;
const PRESENCE_HEARTBEAT_MS=30000;
const ONLINE_STALE_MS=95000;
const BUBBLE_MS=9000;
const WORLD_PERIOD_MS=3*60*60*1000;
const USER_CHAT_TTL_MS=24*60*60*1000;
const MAX_CHAT_HISTORY=200;

const GM_RANK={tierId:"master",tierName:"GAME MASTER",rating:999999};
const GM_EXCLUSIVE_ITEMS=[
  {icon:"👑",name:"Crown of Authority",description:"มงกุฎ GM เฉพาะผู้ดูแลระบบ"},
  {icon:"🪄",name:"Admin Staff",description:"คทาพลังระบบ ไม่อยู่ใน Token Shop"},
  {icon:"🛡️",name:"Guardian Aura",description:"เกราะออร่า GM เฉพาะ Admin UID"},
  {icon:"🔥",name:"Crimson Royal Cape",description:"ผ้าคลุม GM ที่ User ไม่มีสิทธิ์ใช้"},
  {icon:"💠",name:"System Core",description:"แกนพลังลอยรอบตัว GM"}
];

const canvas=$("zoneCanvas");
const ctx=canvas.getContext("2d");
const profileCanvas=$("zoneProfileCanvas");
const profileCtx=profileCanvas.getContext("2d");

let uid=null;
let profile=null;
let players=new Map();
let messagesByUid=new Map();
let chatMessages=[];
let positionsUnsub=null;
let messagesUnsub=null;
let moderationUnsub=null;
let heartbeat=null;
let clockTimer=null;let chatExpiryTimer=null;
let blocked=false;
let lastFrame=performance.now();
let lastPositionSend=0;
let lastChatAt=0;
let movingLeft=false;
let movingRight=false;
let lastWorldPeriod=null;

const me={x:520,y:WALK_Y,direction:"right",moving:false};
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const isGM=()=>uid===ADMIN_UID;
const isGMPlayer=p=>p?.uid===ADMIN_UID;

function setBootStep(step,status,text){
  const row=document.querySelector(`[data-step="${step}"]`);
  if(!row)return;
  row.dataset.status=status;
  const em=row.querySelector("em");
  if(em)em.textContent=text;
}
setBootStep("script","ok",`V${ZONE_VERSION} พร้อม`);

function showGate(title,text,kind="info",help=""){
  blocked=true;
  $("zoneApp").classList.add("hidden");
  $("zoneGate").classList.remove("hidden");
  $("zoneGate").dataset.state=kind;
  $("zoneGateTitle").textContent=title;
  $("zoneGateText").textContent=text;
  const box=$("zoneGateErrorHelp");
  if(help){box.classList.remove("hidden");box.innerHTML=help;}
  else{box.classList.add("hidden");box.innerHTML="";}
}

function showPermissionHelp(error){
  showGate(
    `Firebase Rules ยังไม่ตรงกับ 2D Zone V${ZONE_VERSION}`,
    `ระบบถูก Firebase ปฏิเสธสิทธิ์ (${error?.code||"permission-denied"})`,
    "rules",
    `<strong>วิธีแก้</strong><p>Firebase → Firestore Database → Rules → วาง <code>firestore.rules</code> V${ZONE_VERSION} ทั้งไฟล์ → Publish → รอ 10–30 วินาที → Ctrl+F5</p><small>${esc(error?.message||"")}</small>`
  );
  setBootStep("rules","error","Permission denied");
}

function rankMeta(rank={}){
  const id=String(rank.tierId||"bronze").toLowerCase();
  const map={
    bronze:{name:"Bronze",letter:"B",color:"#9b6b43"},silver:{name:"Silver",letter:"S",color:"#8795a5"},
    gold:{name:"Gold",letter:"G",color:"#d6a51d"},platinum:{name:"Platinum",letter:"P",color:"#3ca7a7"},
    diamond:{name:"Diamond",letter:"D",color:"#557fd8"},master:{name:"Master",letter:"M",color:"#7b4bc4"}
  };
  return {id,...(map[id]||map.bronze)};
}
function rankShieldHTML(rank){
  const r=rankMeta(rank);
  return `<span class="rank-shield rank-${r.id}"><span class="rank-shield-letter">${r.letter}</span></span>`;
}
function equipped(character){return {...DEFAULT_CHARACTER.equipped,...(character?.equipped||{})}}
function itemById(id){return REWARD_ITEMS.find(x=>x.id===id)||null}
function equippedItems(character){return Object.entries(equipped(character)).map(([slot,id])=>({slot,item:itemById(id)})).filter(x=>x.item)}

function moderationState(m){
  const now=Date.now(),bannedUntil=m?.bannedUntil?.toDate?.(),kickedUntil=m?.kickedUntil?.toDate?.();
  return {banned:!!bannedUntil&&bannedUntil.getTime()>now,bannedUntil,kicked:!!kickedUntil&&kickedUntil.getTime()>now,kickedUntil};
}

function worldTimeState(now=Date.now()){
  const block=Math.floor(now/WORLD_PERIOD_MS),isDay=block%2===0,next=(block+1)*WORLD_PERIOD_MS;
  return {period:isDay?"day":"night",isDay,icon:isDay?"☀️":"🌙",label:isDay?"กลางวัน":"กลางคืน",nextChangeAt:next,remaining:Math.max(0,next-now)};
}
function formatCountdown(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  return `${String(Math.floor(total/3600)).padStart(2,"0")}:${String(Math.floor((total%3600)/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
}
function updateWorldClock(){
  const state=worldTimeState();
  $("zoneWorldPeriod").textContent=state.label;$("zoneWorldCountdown").textContent=`เปลี่ยนใน ${formatCountdown(state.remaining)}`;
  $("zoneWorldIcon").textContent=state.icon;$("zoneWorld").dataset.period=state.period;
  if(lastWorldPeriod!==state.period){lastWorldPeriod=state.period;document.documentElement.dataset.worldPeriod=state.period;}
}
function startWorldClock(){clearInterval(clockTimer);updateWorldClock();clockTimer=setInterval(updateWorldClock,1000)}

async function checkModerationBeforeEntry(){
  if(isGM()){setBootStep("rules","ok","GM Authorized");return true;}
  try{
    const snap=await getDoc(doc(db,"zone_moderation",uid));
    setBootStep("rules","ok","Rules พร้อม");
    if(!snap.exists())return true;
    const data=snap.data(),state=moderationState(data);
    if(state.banned){showGate("ถูกระงับการเข้า 2D Zone",`GM แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}${data.banReason?` · ${data.banReason}`:""}`,"banned");return false;}
    if(state.kicked){showGate("ถูก GM เตะออกจาก Zone",`กลับเข้าใหม่ได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}${data.kickReason?` · ${data.kickReason}`:""}`,"kicked");return false;}
    return true;
  }catch(error){if(error?.code==="permission-denied")showPermissionHelp(error);else showGate("ตรวจสอบ Zone ไม่สำเร็จ",error?.message||String(error),"error");return false;}
}

function stopRealtime(){
  blocked=true;movingLeft=false;movingRight=false;clearInterval(heartbeat);
  if(positionsUnsub){positionsUnsub();positionsUnsub=null}if(messagesUnsub){messagesUnsub();messagesUnsub=null}
}
function listenModeration(){
  if(isGM())return;
  if(moderationUnsub)moderationUnsub();
  moderationUnsub=onSnapshot(doc(db,"zone_moderation",uid),snap=>{
    if(!snap.exists())return;const data=snap.data(),state=moderationState(data);
    if(state.banned){stopRealtime();showGate("คุณถูก GM แบนจาก 2D Zone",`แบนถึง ${state.bannedUntil.toLocaleString("th-TH")}${data.banReason?` · เหตุผล: ${data.banReason}`:""}`,"banned");}
    else if(state.kicked){stopRealtime();showGate("คุณถูก GM เตะออกจาก 2D Zone",`กลับเข้าใหม่ได้หลัง ${state.kickedUntil.toLocaleTimeString("th-TH")}${data.kickReason?` · ${data.kickReason}`:""}`,"kicked");}
  },error=>{if(error?.code==="permission-denied")showPermissionHelp(error);});
}

async function loadProfile(){
  setBootStep("profile","loading","กำลังอ่านข้อมูล");
  try{
    if(isGM()){
      let savedX=520,savedDirection="right";
      try{const pos=await getDoc(doc(db,"zone_positions",uid));if(pos.exists()){savedX=Number(pos.data().x)||520;savedDirection=pos.data().direction==="left"?"left":"right";}}catch{}
      profile={uid,studentId:"GM",fullName:"GM",tokenBalance:0,inventory:[],role:"GM",isAdmin:true,rank:GM_RANK,character:{gender:"male",equipped:{}}};
      me.x=Math.max(90,Math.min(WORLD.width-90,savedX));me.direction=savedDirection;
      setBootStep("profile","ok","GM · Exclusive");return true;
    }
    const snap=await getDoc(doc(db,"users",uid));
    if(!snap.exists()){showGate("ไม่พบข้อมูล User","กรุณากลับไปลงทะเบียนใหม่","profile");setBootStep("profile","error","ไม่พบข้อมูล");return false;}
    profile={uid,...snap.data()};
    if(!["male","female"].includes(profile.character?.gender)){showGate("กรุณาเลือกตัวละครก่อน","กลับหน้า User แล้วเลือกตัวละครชายหรือหญิงก่อนเข้า 2D Zone","setup");setBootStep("profile","error","ยังไม่เลือกตัวละคร");return false;}
    const z=profile.zone||{};me.x=Math.max(90,Math.min(WORLD.width-90,Number(z.x)||520));me.direction=z.direction==="left"?"left":"right";
    setBootStep("profile","ok",String(profile.studentId||"พร้อม"));return true;
  }catch(error){if(error?.code==="permission-denied")showPermissionHelp(error);else showGate("โหลดข้อมูล User ไม่สำเร็จ",error?.message||String(error),"profile");setBootStep("profile","error","เกิดข้อผิดพลาด");return false;}
}

async function syncPublicProfile(){
  if(blocked||!uid||!profile)return;
  try{
    const gm=isGM();
    await setDoc(doc(db,"public_profiles",uid),{
      uid,studentId:gm?"GM":profile.studentId,fullName:gm?"GM":profile.fullName,
      role:gm?"GM":"USER",isAdmin:gm,rank:gm?GM_RANK:(profile.rank||null),
      character:gm?{gender:"male",equipped:{},exclusive:"gm_v1"}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("syncPublicProfile:",error)}
}
async function publishPresence(){
  if(blocked||!uid||!profile)return;
  try{
    const gm=isGM();
    await setDoc(doc(db,"presence",uid),{
      uid,studentId:gm?"GM":profile.studentId,fullName:gm?"GM":profile.fullName,
      role:gm?"GM":"USER",isAdmin:gm,rank:gm?GM_RANK:(profile.rank||null),area:"zone",online:true,lastSeenAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn("presence:",error)}
}
async function publishPosition(force=false){
  if(blocked||!uid||!profile)return;
  const now=performance.now();if(!force&&now-lastPositionSend<POSITION_SEND_MS)return;lastPositionSend=now;
  try{
    const gm=isGM();
    await setDoc(doc(db,"zone_positions",uid),{
      uid,studentId:gm?"GM":String(profile.studentId||""),role:gm?"GM":"USER",isAdmin:gm,
      rank:gm?GM_RANK:(profile.rank||null),
      character:gm?{gender:"male",equipped:{},exclusive:"gm_v1"}:{gender:profile.character?.gender||"male",equipped:equipped(profile.character)},
      zoneId:ZONE_ID,x:Math.round(me.x*10)/10,y:WALK_Y,direction:me.direction,moving:me.moving,online:true,updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){if(error?.code==="permission-denied"&&!blocked)showPermissionHelp(error);else console.warn("position:",error)}
}

function listenPositions(){
  if(positionsUnsub)positionsUnsub();
  const q=query(collection(db,"zone_positions"),where("zoneId","==",ZONE_ID));
  positionsUnsub=onSnapshot(q,snap=>{
    const now=Date.now();players.clear();
    snap.docs.forEach(d=>{const p={uid:d.id,...d.data()};if(!p.online)return;const dt=p.updatedAt?.toDate?.();if(dt&&now-dt.getTime()>ONLINE_STALE_MS)return;players.set(d.id,p);});
    $("zoneOnlineCount").textContent=Math.max(1,players.size);setBootStep("world","ok",`${Math.max(1,players.size)} online`);$("zoneConnectionBadge").dataset.state="online";
  },error=>{$("zoneConnectionBadge").dataset.state="error";if(error?.code==="permission-denied")showPermissionHelp(error);else showGate("Realtime Zone ขัดข้อง",error?.message||String(error),"error");});
}

function messageVisible(m,now=Date.now()){
  if(m?.isGM===true||m?.uid===ADMIN_UID)return true;
  const created=m?.createdAt?.toDate?.();
  return !!created && (now-created.getTime())<USER_CHAT_TTL_MS;
}
function messageExpiryText(m){
  if(m?.isGM===true||m?.uid===ADMIN_UID)return "GM · ถาวร";
  const created=m?.createdAt?.toDate?.();
  const until=created?created.getTime()+USER_CHAT_TTL_MS:Date.now();
  const left=Math.max(0,until-Date.now());
  const h=Math.floor(left/3600000),min=Math.floor((left%3600000)/60000);
  return `เหลือ ${h}ชม. ${min}น.`;
}
function renderChatHistory(){
  if(!$("zoneChatHistoryList"))return;
  const visible=chatMessages.filter(m=>messageVisible(m)).slice(0,MAX_CHAT_HISTORY).reverse();
  $("zoneChatHistoryList").innerHTML=visible.length?visible.map(m=>{
    const gm=m.isGM===true||m.uid===ADMIN_UID;
    const dt=m.createdAt?.toDate?.();
    return `<article class="zone-chat-log-row ${gm?"gm":"user"}">
      <div class="zone-chat-log-avatar">${gm?"GM":esc(String(m.studentId||"?").slice(-2))}</div>
      <div class="zone-chat-log-body">
        <div><strong>${gm?"GM · GAME MASTER":esc(m.studentId||"USER")}</strong><time>${dt?dt.toLocaleString("th-TH"):"กำลังส่ง"}</time></div>
        <p>${esc(m.text||"")}</p>
        <small>${messageExpiryText(m)}</small>
      </div>
    </article>`;
  }).join(""):`<div class="zone-chat-empty">ยังไม่มีข้อความในช่วง 24 ชั่วโมง</div>`;
  $("zoneChatHistoryList").scrollTop=$("zoneChatHistoryList").scrollHeight;
}
function refreshVisibleZoneMessages(){const latest=new Map();chatMessages.filter(m=>messageVisible(m)).forEach(m=>{if(!latest.has(m.uid))latest.set(m.uid,m)});messagesByUid=latest;if(!$('zoneChatHistoryModal').classList.contains('hidden'))renderChatHistory()}
function listenMessages(){
  if(messagesUnsub)messagesUnsub();
  const q=query(collection(db,"zone_messages"),orderBy("createdAt","desc"),limit(MAX_CHAT_HISTORY));
  messagesUnsub=onSnapshot(q,snap=>{
    chatMessages=snap.docs.map(d=>({id:d.id,...d.data()})).filter(m=>m.zoneId===ZONE_ID);
    refreshVisibleZoneMessages();
  },error=>{if(error?.code==="permission-denied")showPermissionHelp(error);else console.warn("messages:",error)});
}
async function sendMessage(text){
  const clean=String(text||"").trim().slice(0,120);
  if(blocked||!clean||!uid||!profile)return;
  if(Date.now()-lastChatAt<900)return;
  lastChatAt=Date.now();
  const gm=isGM();
  const payload={uid,studentId:gm?"GM":String(profile.studentId||""),text:clean,zoneId:ZONE_ID,isGM:gm,createdAt:serverTimestamp()};
  if(!gm)payload.expiresAt=Timestamp.fromMillis(Date.now()+USER_CHAT_TTL_MS);
  try{
    const messageRef=doc(collection(db,"zone_messages"));
    const archiveRef=doc(db,"zone_chat_archive",messageRef.id);
    const batch=writeBatch(db);
    batch.set(messageRef,payload);
    batch.set(archiveRef,{...payload,messageId:messageRef.id,archivedAt:serverTimestamp()});
    await batch.commit();
  }catch(error){
    if(error?.code==="permission-denied")showPermissionHelp(error);
    else console.warn("chat:",error);
  }
}

$("zoneChatForm").addEventListener("submit",async e=>{e.preventDefault();const input=$("zoneChatInput"),text=input.value;input.value="";await sendMessage(text);input.focus({preventScroll:true})});
$("openZoneChatHistory").onclick=()=>{renderChatHistory();$("zoneChatHistoryModal").classList.remove("hidden")};
$("closeZoneChatHistory").onclick=()=>$("zoneChatHistoryModal").classList.add("hidden");

function startMove(dir){if(blocked)return;if(dir==="left"){movingLeft=true;me.direction="left"}if(dir==="right"){movingRight=true;me.direction="right"}}
function stopMove(dir){if(dir==="left")movingLeft=false;if(dir==="right")movingRight=false;me.moving=movingLeft||movingRight;publishPosition(true)}
function bindHold(button,dir){button.style.touchAction="none";button.addEventListener("pointerdown",e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);startMove(dir)});const stop=()=>stopMove(dir);button.addEventListener("pointerup",stop);button.addEventListener("pointercancel",stop);button.addEventListener("pointerleave",stop);button.addEventListener("lostpointercapture",stop)}
bindHold($("moveLeftButton"),"left");bindHold($("moveRightButton"),"right");
window.addEventListener("keydown",e=>{if(document.activeElement===$("zoneChatInput"))return;const k=e.key.toLowerCase();if(k==="a"||k==="arrowleft"){e.preventDefault();startMove("left")}if(k==="d"||k==="arrowright"){e.preventDefault();startMove("right")}if(k==="enter")$("zoneChatInput").focus({preventScroll:true})});
window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();if(k==="a"||k==="arrowleft")stopMove("left");if(k==="d"||k==="arrowright")stopMove("right")});
function update(dt){if(blocked)return;let dx=0;if(movingLeft)dx-=1;if(movingRight)dx+=1;me.moving=dx!==0;if(!dx)return;me.x=Math.max(70,Math.min(WORLD.width-70,me.x+dx*PLAYER_SPEED*dt));publishPosition(false)}
function resizeCanvas(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr))}
function cameraX(){const scale=canvas.clientHeight/WORLD.height,visibleW=canvas.clientWidth/Math.max(.01,scale);return Math.max(0,Math.min(WORLD.width-visibleW,me.x-visibleW/2))}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}

function drawThaiHouse(c,x,y,w,h,wall,roof,label,day){
  c.save();c.fillStyle=day?"rgba(67,51,33,.20)":"rgba(0,0,0,.24)";rr(c,x+18,y+h-8,w-5,22,8);c.fill();
  c.fillStyle=wall;rr(c,x,y+70,w,h-70,10);c.fill();c.fillStyle="#d6a765";for(let px=x+25;px<x+w-20;px+=65)c.fillRect(px,y+85,9,h-95);
  c.fillStyle=roof;c.beginPath();c.moveTo(x-30,y+90);c.lineTo(x+w*.5,y);c.lineTo(x+w+30,y+90);c.lineTo(x+w,y+112);c.lineTo(x,y+112);c.closePath();c.fill();
  c.strokeStyle="rgba(255,255,255,.12)";c.lineWidth=4;for(let i=0;i<8;i++){const px=x+30+i*(w-60)/7;c.beginPath();c.moveTo(x+w*.5,y+8);c.lineTo(px,y+103);c.stroke()}
  for(let i=0;i<3;i++){const wx=x+48+i*(w-120)/2;c.fillStyle=day?"#9bd1ef":"#f5c562";c.fillRect(wx,y+135,50,48);c.strokeStyle="#70452d";c.lineWidth=5;c.strokeRect(wx,y+135,50,48)}
  c.fillStyle="#4d2f24";rr(c,x+w*.44,y+166,58,h-170,5);c.fill();c.fillStyle="rgba(17,34,43,.9)";rr(c,x+w*.5-78,y+215,156,38,8);c.fill();c.fillStyle="#ffe3a0";c.font="700 16px system-ui";c.textAlign="center";c.fillText(label,x+w*.5,y+240);c.restore();
}
function drawMarketStall(c,x,y,w,h,awning,label,isShop=false,day=false){
  c.save();if(isShop){c.shadowColor="#ffd25b";c.shadowBlur=day?14:25}c.fillStyle="#553725";rr(c,x,y+35,w,h-35,8);c.fill();c.fillStyle=awning;
  c.beginPath();c.moveTo(x-10,y+35);c.lineTo(x+18,y);c.lineTo(x+w-18,y);c.lineTo(x+w+10,y+35);c.closePath();c.fill();c.fillStyle="#e9eee5";for(let i=0;i<6;i++)c.fillRect(x+15+i*(w-30)/6,y+4,(w-30)/12,30);
  c.fillStyle="#b87931";c.fillRect(x+12,y+h-35,w-24,24);["#f1b746","#7bbc55","#df704e","#b878d0","#58a5c9"].forEach((color,i)=>{c.fillStyle=color;c.beginPath();c.arc(x+55+i*47,y+h-48,17,0,Math.PI*2);c.fill()});
  c.shadowBlur=0;c.fillStyle=isShop?"#fff1a6":"#fff1c8";c.font=isShop?"900 18px system-ui":"700 15px system-ui";c.textAlign="center";c.fillText(label,x+w/2,y+82);if(isShop){c.strokeStyle="#ffd65c";c.lineWidth=3;rr(c,x-10,y-10,w+20,h+20,14);c.stroke()}c.restore();
}
function drawLantern(c,x,y,day){c.save();c.fillStyle=day?"rgba(255,170,55,.05)":"rgba(255,163,59,.14)";c.beginPath();c.arc(x,y,46,0,Math.PI*2);c.fill();c.strokeStyle="#34251e";c.lineWidth=5;c.beginPath();c.moveTo(x,y-55);c.lineTo(x,y-20);c.stroke();c.fillStyle="#e65d3b";rr(c,x-17,y-20,34,42,10);c.fill();c.fillStyle=day?"#f4b74a":"#ffd46f";rr(c,x-10,y-13,20,28,7);c.fill();c.restore()}

function drawWorld(){
  const time=worldTimeState(),day=time.isDay,scale=canvas.clientHeight/WORLD.height,cam=cameraX();
  ctx.save();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.scale(canvas.width/canvas.clientWidth,canvas.height/canvas.clientHeight);ctx.scale(scale,scale);ctx.translate(-cam,0);
  const sky=ctx.createLinearGradient(0,0,0,590);if(day){sky.addColorStop(0,"#6bc5f1");sky.addColorStop(.56,"#aee0f2");sky.addColorStop(1,"#d9f0d1")}else{sky.addColorStop(0,"#06182b");sky.addColorStop(.52,"#0d3555");sky.addColorStop(1,"#21586d")}ctx.fillStyle=sky;ctx.fillRect(0,0,WORLD.width,WORLD.height);
  if(day){ctx.fillStyle="rgba(255,228,88,.18)";ctx.beginPath();ctx.arc(1510,120,95,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffe064";ctx.beginPath();ctx.arc(1510,120,54,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.75)";for(const [x,y,w] of [[300,120,150],[900,180,190],[2020,110,170],[2600,185,150]]){ctx.beginPath();ctx.ellipse(x,y,w*.35,28,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x+w*.25,y-8,w*.25,35,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x+w*.5,y+3,w*.32,25,0,0,Math.PI*2);ctx.fill()}}else{ctx.fillStyle="rgba(255,245,190,.11)";ctx.beginPath();ctx.arc(1510,120,95,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff1bd";ctx.beginPath();ctx.arc(1510,120,56,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,235,.82)";for(let x=55;x<WORLD.width;x+=83){const y=45+((x*37)%265);ctx.fillRect(x,y,2+(x%3),2+(x%2))}}
  ctx.fillStyle=day?"#2d6a3d":"#08291f";for(let x=-40;x<WORLD.width;x+=86){const h=80+Math.abs((x*13)%65);ctx.beginPath();ctx.arc(x,420-h*.45,65,0,Math.PI*2);ctx.fill();ctx.fillRect(x-13,420-h*.25,26,h*.4)}
  ctx.fillStyle=day?"#6f9d58":"#263c35";ctx.fillRect(0,520,WORLD.width,380);ctx.fillStyle=day?"#b5a78b":"#4b5860";ctx.fillRect(0,625,WORLD.width,220);ctx.strokeStyle=day?"rgba(93,78,58,.17)":"rgba(255,255,255,.075)";ctx.lineWidth=3;for(let x=0;x<WORLD.width;x+=95){ctx.beginPath();ctx.moveTo(x,630);ctx.lineTo(x+35,840);ctx.stroke()}for(let y=650;y<845;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke()}
  drawThaiHouse(ctx,120,340,420,250,"#8d3d2f","#244f68","LEARNING HOUSE",day);drawMarketStall(ctx,650,465,320,155,"#e6a33b","TOKEN SHOP",true,day);drawThaiHouse(ctx,1070,315,440,275,"#6b3e2e","#5a3572","CODING HOUSE",day);drawMarketStall(ctx,1710,470,310,150,"#5aa174","MARKET",false,day);drawThaiHouse(ctx,2200,335,390,255,"#8a4c2b","#1d5872","PVP INN",day);drawThaiHouse(ctx,2650,355,300,235,"#63422f","#33536a","RANK HALL",day);[570,1010,1580,2070,2600].forEach(x=>drawLantern(ctx,x,500,day));
  ctx.fillStyle=day?"#337448":"#163f2e";for(let x=15;x<WORLD.width;x+=140){ctx.beginPath();ctx.arc(x,575,34,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x+30,585,28,0,Math.PI*2);ctx.fill()}
  const list=[...players.values()].sort((a,b)=>Number(a.x||0)-Number(b.x||0));if(!list.some(p=>p.uid===uid))list.push({uid,studentId:isGM()?"GM":profile?.studentId,rank:isGM()?GM_RANK:profile?.rank,character:isGM()?{gender:"male",exclusive:"gm_v1"}:{gender:profile?.character?.gender,equipped:equipped(profile?.character)},x:me.x,direction:me.direction,isAdmin:isGM(),role:isGM()?"GM":"USER"});for(const p of list)drawCharacter(ctx,p,Number(p.x||0),WALK_Y,1,true);ctx.restore();
}

function drawRankShield(c,x,y,rank){const r=rankMeta(rank);c.save();c.translate(x,y);c.fillStyle=r.color;c.beginPath();c.moveTo(-11,-8);c.lineTo(11,-8);c.lineTo(9,6);c.lineTo(0,14);c.lineTo(-9,6);c.closePath();c.fill();c.fillStyle="#fff";c.font="900 10px system-ui";c.textAlign="center";c.fillText(r.letter,0,2);c.restore()}

function drawGMCharacter(c,p,x,y,scale=1,drawName=true){
  const facing=p.direction==="left"?-1:1;c.save();c.translate(x,y);c.scale(scale,scale);
  // Triple exclusive aura
  c.save();c.shadowColor="#ff4d79";c.shadowBlur=22;for(const [rx,ry,color,w] of [[62,92,"rgba(255,71,102,.78)",7],[52,82,"rgba(255,208,70,.88)",4],[43,72,"rgba(81,221,255,.75)",3]]){c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.ellipse(0,-34,rx,ry,0,0,Math.PI*2);c.stroke()}c.shadowBlur=0;c.restore();
  // Orbiting system cores
  const t=performance.now()/700;for(let i=0;i<3;i++){const a=t+i*Math.PI*2/3,ox=Math.cos(a)*68,oy=-48+Math.sin(a)*26;c.fillStyle=i===0?"#5de7ff":i===1?"#ffd452":"#ff5680";c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(ox,oy,6,0,Math.PI*2);c.fill();c.shadowBlur=0}
  // Cape
  c.fillStyle="#671327";c.beginPath();c.moveTo(-38,-58);c.lineTo(38,-58);c.lineTo(55,42);c.lineTo(0,22);c.lineTo(-55,42);c.closePath();c.fill();c.strokeStyle="#f0c64d";c.lineWidth=5;c.stroke();
  // Shadow
  c.fillStyle="rgba(0,0,0,.28)";c.beginPath();c.ellipse(0,30,32,10,0,0,Math.PI*2);c.fill();
  c.save();c.scale(facing,1);
  // Boots/legs
  c.fillStyle="#241b2f";rr(c,-18,5,15,34,5);c.fill();rr(c,3,5,15,34,5);c.fill();c.fillStyle="#e7bd42";rr(c,-20,31,20,10,4);c.fill();rr(c,1,31,20,10,4);c.fill();
  // Armor body
  c.fillStyle="#21122f";rr(c,-28,-53,56,62,14);c.fill();c.strokeStyle="#f0c64d";c.lineWidth=4;c.stroke();c.fillStyle="#811e32";rr(c,-20,-45,40,48,10);c.fill();
  // Chest system gem
  c.fillStyle="#5de7ff";c.shadowColor="#5de7ff";c.shadowBlur=13;c.beginPath();c.moveTo(0,-39);c.lineTo(9,-28);c.lineTo(0,-17);c.lineTo(-9,-28);c.closePath();c.fill();c.shadowBlur=0;
  // Shoulder armor
  c.fillStyle="#d9aa2d";c.beginPath();c.arc(-31,-40,13,Math.PI*.7,Math.PI*1.7);c.fill();c.beginPath();c.arc(31,-40,13,Math.PI*1.3,Math.PI*.3);c.fill();
  // arms
  c.fillStyle="#e8bd98";rr(c,-38,-35,11,44,6);c.fill();rr(c,27,-35,11,44,6);c.fill();
  // head
  c.fillStyle="#efc6a0";c.beginPath();c.arc(0,-79,24,0,Math.PI*2);c.fill();c.fillStyle="#211921";c.beginPath();c.arc(0,-87,25,Math.PI,Math.PI*2);c.fill();c.fillRect(-24,-89,8,18);c.fillRect(16,-89,8,19);
  // visor eyes
  c.fillStyle="rgba(32,40,59,.95)";rr(c,-20,-82,40,13,5);c.fill();c.strokeStyle="#5de7ff";c.lineWidth=2;c.stroke();c.fillStyle="#5de7ff";c.fillRect(7,-78,8,3);
  // exclusive crown
  c.fillStyle="#ffd650";c.shadowColor="#ffd650";c.shadowBlur=9;c.beginPath();c.moveTo(-28,-101);c.lineTo(-25,-125);c.lineTo(-10,-108);c.lineTo(0,-134);c.lineTo(11,-108);c.lineTo(26,-126);c.lineTo(29,-101);c.closePath();c.fill();c.shadowBlur=0;c.fillStyle="#ff4f79";c.beginPath();c.arc(0,-115,5,0,Math.PI*2);c.fill();
  // Admin staff
  c.strokeStyle="#e9bf46";c.lineWidth=6;c.beginPath();c.moveTo(38,-31);c.lineTo(55,35);c.stroke();c.fillStyle="#5de7ff";c.shadowColor="#5de7ff";c.shadowBlur=13;c.beginPath();c.arc(37,-38,11,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle="#ffd650";c.lineWidth=3;c.beginPath();c.arc(37,-38,17,0,Math.PI*2);c.stroke();
  c.restore();
  if(drawName){
    c.font="900 14px system-ui";const label="GM",w=Math.max(88,c.measureText(label).width+42);c.fillStyle="rgba(92,12,28,.96)";rr(c,-w/2,-164,w,35,11);c.fill();c.strokeStyle="#f0c64d";c.lineWidth=2;c.stroke();c.fillStyle="#ffe8a5";c.textAlign="center";c.fillText(label,0,-141);
    c.fillStyle="rgba(28,15,42,.9)";rr(c,-64,-125,128,28,8);c.fill();c.font="16px system-ui";["👑","🪄","🛡️","🔥"].forEach((it,i)=>c.fillText(it,-42+i*28,-105));drawBubble(c,p);
  }
  c.restore();
}

function drawCharacter(c,p,x,y,scale=1,drawName=true){
  if(isGMPlayer(p)){drawGMCharacter(c,p,x,y,scale,drawName);return;}
  const char=p.character||{},eq=equipped(char),gender=char.gender==="female"?"female":"male",isMe=p.uid===uid,facing=p.direction==="left"?-1:1;c.save();c.translate(x,y);c.scale(scale,scale);
  const back=itemById(eq.back),aura=itemById(eq.aura),head=itemById(eq.head),face=itemById(eq.face),top=itemById(eq.top),hand=itemById(eq.hand),shoes=itemById(eq.shoes),pet=itemById(eq.pet);
  if(aura?.visual==="gold_aura"){c.strokeStyle="rgba(255,217,70,.76)";c.lineWidth=7;c.shadowColor="#ffd84d";c.shadowBlur=18;c.beginPath();c.ellipse(0,-38,48,78,0,0,Math.PI*2);c.stroke();c.shadowBlur=0}if(aura?.visual==="master_halo"){c.strokeStyle="#62d9ff";c.lineWidth=6;c.shadowColor="#62d9ff";c.shadowBlur=14;c.beginPath();c.ellipse(0,-103,40,12,0,0,Math.PI*2);c.stroke();c.shadowBlur=0}if(aura?.visual==="throne"){c.fillStyle="#54234c";rr(c,-65,-102,130,145,38);c.fill();c.strokeStyle="#e6bd44";c.lineWidth=6;c.stroke()}
  if(back?.visual==="backpack"){c.fillStyle="#315f89";rr(c,-36,-54,72,72,18);c.fill()}else if(back?.visual==="royal_cape"){c.fillStyle="#6d2458";c.beginPath();c.moveTo(-35,-58);c.lineTo(35,-58);c.lineTo(48,39);c.lineTo(0,23);c.lineTo(-48,39);c.closePath();c.fill();c.strokeStyle="#e9c148";c.lineWidth=5;c.stroke()}else if(back?.visual==="dragon_wings"){c.fillStyle="#b33a75";c.shadowColor="#f06a9a";c.shadowBlur=14;c.beginPath();c.moveTo(-18,-56);c.lineTo(-80,-105);c.lineTo(-63,-45);c.lineTo(-108,-18);c.lineTo(-49,-2);c.lineTo(-20,28);c.closePath();c.fill();c.beginPath();c.moveTo(18,-56);c.lineTo(80,-105);c.lineTo(63,-45);c.lineTo(108,-18);c.lineTo(49,-2);c.lineTo(20,28);c.closePath();c.fill();c.shadowBlur=0}
  c.fillStyle="rgba(0,0,0,.24)";c.beginPath();c.ellipse(0,28,27,9,0,0,Math.PI*2);c.fill();c.save();c.scale(facing,1);c.fillStyle="#e8bd98";c.fillRect(-13,8,9,28);c.fillRect(5,8,9,28);c.fillStyle=shoes?.visual==="shoe_white"?"#f7f7f5":"#202a35";rr(c,-17,30,16,9,4);c.fill();rr(c,2,30,16,9,4);c.fill();c.fillStyle="#315b82";rr(c,-20,-3,40,20,7);c.fill();let topColor="#f3f0e8";if(top?.visual==="shirt_blue")topColor="#3381b8";if(top?.visual==="cyber_jacket")topColor="#142d42";c.fillStyle=topColor;rr(c,-22,-45,44,48,13);c.fill();if(top?.visual==="cyber_jacket"){c.strokeStyle="#29d8e4";c.lineWidth=3;c.stroke()}if(top?.visual==="thai_sash"){c.strokeStyle="#e5524b";c.lineWidth=8;c.beginPath();c.moveTo(-12,-43);c.lineTo(14,1);c.stroke();c.strokeStyle="#f0c94e";c.lineWidth=3;c.stroke()}c.fillStyle="#eabf99";rr(c,-31,-39,10,42,6);c.fill();rr(c,21,-39,10,42,6);c.fill();if(gender==="female"){c.fillStyle="#2c211d";c.beginPath();c.ellipse(0,-72,27,35,0,0,Math.PI*2);c.fill()}c.fillStyle="#efc6a0";c.beginPath();c.arc(0,-72,23,0,Math.PI*2);c.fill();c.fillStyle="#2c211d";c.beginPath();c.arc(0,-80,24,Math.PI,Math.PI*2);c.fill();if(gender==="male"){c.fillRect(-23,-82,8,17);c.fillRect(15,-84,8,19)}else{c.fillRect(-24,-80,8,35);c.fillRect(16,-80,8,37)}c.fillStyle="#252225";c.fillRect(7,-74,4,4);if(face?.visual==="glasses"){c.strokeStyle="#27384a";c.lineWidth=3;c.beginPath();c.arc(-8,-73,8,0,Math.PI*2);c.stroke();c.beginPath();c.arc(9,-73,8,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(0,-73);c.lineTo(2,-73);c.stroke()}if(head?.visual==="cap"){c.fillStyle="#316ca0";rr(c,-25,-101,50,17,8);c.fill();c.fillRect(14,-91,24,6)}else if(head?.visual==="gold_crown"){c.fillStyle="#e6b82f";c.beginPath();c.moveTo(-25,-94);c.lineTo(-24,-117);c.lineTo(-9,-101);c.lineTo(0,-124);c.lineTo(11,-101);c.lineTo(26,-116);c.lineTo(25,-94);c.closePath();c.fill()}else if(head?.visual==="neon_headset"){c.strokeStyle="#d846e8";c.lineWidth=7;c.beginPath();c.arc(0,-78,29,Math.PI,0);c.stroke()}if(hand?.visual==="tablet"){c.fillStyle="#132333";rr(c,22,-29,27,37,4);c.fill();c.strokeStyle="#42d6ee";c.lineWidth=3;c.stroke()}c.restore();
  if(pet?.visual==="phoenix_pet"){c.fillStyle="#f04e2f";c.shadowColor="#ff9c35";c.shadowBlur=12;c.beginPath();c.moveTo(56,-50);c.lineTo(68,-70);c.lineTo(75,-48);c.lineTo(96,-61);c.lineTo(82,-34);c.lineTo(95,-12);c.lineTo(68,-22);c.lineTo(57,-2);c.lineTo(52,-27);c.lineTo(36,-13);c.lineTo(42,-37);c.closePath();c.fill();c.shadowBlur=0}if(isMe){c.strokeStyle="#ffd45e";c.lineWidth=4;c.beginPath();c.ellipse(0,-28,45,78,0,0,Math.PI*2);c.stroke()}
  if(drawName){const label=String(p.studentId||"USER").slice(0,18);c.font="800 14px system-ui";const w=Math.max(96,c.measureText(label).width+48);c.fillStyle="rgba(5,18,28,.88)";rr(c,-w/2,-145,w,30,10);c.fill();c.fillStyle="#fff";c.textAlign="center";c.fillText(label,0,-125);drawRankShield(c,-w/2+18,-131,p.rank);const items=Object.values(eq).filter(Boolean).map(itemById).filter(Boolean).slice(0,3);if(items.length){c.fillStyle="rgba(5,18,28,.74)";rr(c,-42,-111,84,25,8);c.fill();c.font="15px system-ui";items.forEach((it,i)=>c.fillText(it.icon,-25+i*25,-93))}drawBubble(c,p)}c.restore();
}

function drawBubble(c,p){
  const m=messagesByUid.get(p.uid);if(!m?.text)return;const dt=m.createdAt?.toDate?.();if(dt&&Date.now()-dt.getTime()>BUBBLE_MS)return;
  const text=String(m.text).slice(0,120);c.font="600 15px system-ui";const maxW=250,lines=[];let line="";for(const ch of [...text]){const test=line+ch;if(c.measureText(test).width>maxW&&line){lines.push(line);line=ch}else line=test}if(line)lines.push(line);const visible=lines.slice(0,3),bw=Math.min(maxW+28,Math.max(120,...visible.map(t=>c.measureText(t).width+28))),bh=18+visible.length*22,by=-166-bh,gm=isGMPlayer(p);
  c.fillStyle=gm?"rgba(255,246,205,.98)":"rgba(255,255,255,.97)";rr(c,-bw/2,by,bw,bh,14);c.fill();c.strokeStyle=gm?"#d89d25":"rgba(30,55,73,.18)";c.lineWidth=gm?3:2;c.stroke();c.fillStyle=gm?"#6b1c2c":"#19364a";c.textAlign="center";c.font=gm?"800 15px system-ui":"600 15px system-ui";visible.forEach((ln,i)=>c.fillText(ln,0,by+25+i*22));
}
function render(){drawWorld()}function loop(now){const dt=Math.min(.04,(now-lastFrame)/1000);lastFrame=now;update(dt);render();requestAnimationFrame(loop)}
function canvasToWorld(clientX,clientY){const rect=canvas.getBoundingClientRect(),scale=rect.height/WORLD.height;return {x:(clientX-rect.left)/scale+cameraX(),y:(clientY-rect.top)/scale}}
canvas.addEventListener("click",e=>{const pt=canvasToWorld(e.clientX,e.clientY);if(pt.x>=620&&pt.x<=1010&&pt.y>=430&&pt.y<=650){if(!isGM())openShop();return}let selected=null,best=9999;for(const p of players.values()){const d=Math.hypot(Number(p.x||0)-pt.x,WALK_Y-pt.y);if(d<70&&d<best){selected=p;best=d}}if(selected)openPlayerCard(selected)});
function openPlayerCard(p){
  const gm=isGMPlayer(p);$("zonePlayerCardId").textContent=gm?"GM":(p.studentId||"USER");$("zonePlayerCardShield").innerHTML=rankShieldHTML(gm?GM_RANK:p.rank);$("zonePlayerCardRank").textContent=gm?"ผู้ดูแลระบบ 2D Zone · Exclusive Character":`${p.rank?.tierName||"Bronze"} · ${Number(p.rank?.rating||0)} Rating`;$("zonePlayerCardItemTitle").textContent=gm?"GM EXCLUSIVE · User ไม่สามารถครอบครอง":"ไอเท็มที่กำลังสวม";
  if(gm)$("zonePlayerCardItems").innerHTML=GM_EXCLUSIVE_ITEMS.map(x=>`<div class="gm-exclusive-mini"><span>${x.icon}</span><small>${esc(x.name)}</small></div>`).join("");else{const list=equippedItems(p.character);$("zonePlayerCardItems").innerHTML=list.length?list.map(({item})=>`<div><span>${item.icon}</span><small>${esc(item.name)}</small></div>`).join(""):`<div class="empty-mini">ยังไม่ได้สวมไอเท็ม</div>`}$("zonePlayerCard").classList.remove("hidden");
}
$("closeZonePlayerCard").onclick=()=>$("zonePlayerCard").classList.add("hidden");

function renderShop(){
  if(!profile||isGM())return;const owned=new Set(profile.inventory||[]),eq=equipped(profile.character),equippedIds=new Set(Object.values(eq).filter(Boolean)),balance=Number(profile.tokenBalance||0);$("zoneTokenBalance").textContent=balance.toLocaleString();$("zoneShopBalance").textContent=balance.toLocaleString();const items=[...REWARD_ITEMS].sort((a,b)=>(RARITY_META[a.rarity]?.order||0)-(RARITY_META[b.rarity]?.order||0)||a.cost-b.cost);
  $("zoneShopGrid").innerHTML=items.map(item=>{const own=owned.has(item.id),wearing=equippedIds.has(item.id);return `<article class="zone-shop-item rarity-${item.rarity} ${wearing?"wearing":""}"><div class="zone-shop-rarity">${RARITY_META[item.rarity]?.name||item.rarity}</div><div class="zone-shop-icon">${item.icon}</div><strong>${esc(item.name)}</strong><small>${esc(item.description)}</small><em>${item.cost.toLocaleString()} Token</em><button class="btn ${wearing?"ghost":own?"secondary":"zone-buy-btn"}" data-zone-shop-item="${item.id}" ${!own&&balance<item.cost?"disabled":""}>${wearing?"ถอด":own?"สวมใส่":balance<item.cost?"Token ไม่พอ":"แลกไอเท็ม"}</button></article>`}).join("");document.querySelectorAll("[data-zone-shop-item]:not([disabled])").forEach(btn=>{btn.onclick=()=>handleShopItem(btn.dataset.zoneShopItem)});
}
async function refreshProfile(){const snap=await getDoc(doc(db,"users",uid));if(snap.exists())profile={uid,...snap.data()};renderShop();await syncPublicProfile();await publishPosition(true)}
async function handleShopItem(itemId){
  if(isGM())return;const item=itemById(itemId);if(!item||!profile)return;const userRef=doc(db,"users",uid),owned=(profile.inventory||[]).includes(itemId);if(!owned){try{await runTransaction(db,async tx=>{const snap=await tx.get(userRef);if(!snap.exists())throw new Error("ไม่พบข้อมูล User");const d=snap.data(),balance=Number(d.tokenBalance||0),inv=Array.isArray(d.inventory)?d.inventory:[];if(inv.includes(itemId))return;if(balance<item.cost)throw new Error("Token ไม่พอ");tx.update(userRef,{tokenBalance:balance-item.cost,inventory:[...inv,itemId],updatedAt:serverTimestamp()})});await refreshProfile()}catch(error){alert(error.message)}return}const current=equipped(profile.character);current[item.slot]=current[item.slot]===itemId?null:itemId;const character={...DEFAULT_CHARACTER,...(profile.character||{}),equipped:current};await updateDoc(userRef,{character,updatedAt:serverTimestamp()});profile.character=character;renderShop();await syncPublicProfile();await publishPosition(true);drawOwnProfile();
}
function openShop(){if(isGM())return;renderShop();$("zoneShopModal").classList.remove("hidden")}$("openZoneShop").onclick=openShop;$("closeZoneShop").onclick=()=>$("zoneShopModal").classList.add("hidden");
function drawOwnProfile(){if(!profile)return;profileCtx.clearRect(0,0,profileCanvas.width,profileCanvas.height);const time=worldTimeState(),bg=profileCtx.createLinearGradient(0,0,0,430);if(time.isDay){bg.addColorStop(0,"#7fcdf0");bg.addColorStop(1,"#6e9b59")}else{bg.addColorStop(0,"#102f47");bg.addColorStop(1,"#315e52")}profileCtx.fillStyle=bg;profileCtx.fillRect(0,0,420,430);const p={uid,studentId:isGM()?"GM":profile.studentId,rank:isGM()?GM_RANK:profile.rank,character:isGM()?{gender:"male",exclusive:"gm_v1"}:{gender:profile.character?.gender,equipped:equipped(profile.character)},direction:"right",isAdmin:isGM()};drawCharacter(profileCtx,p,210,345,1.65,false)}
$("openMyZoneProfile").onclick=()=>{$("zoneProfileStudentId").textContent=isGM()?"GM":(profile?.studentId||"-");$("zoneProfileKicker").textContent=isGM()?"GM EXCLUSIVE CHARACTER":"MY CHARACTER";$("zoneProfileHelp").textContent=isGM()?"ตัวละครและไอเท็มชุดนี้ผูกกับ ADMIN_UID เท่านั้น User ไม่สามารถซื้อหรือสวมตามได้":"ซื้อและสวมใส่ไอเท็มได้จาก Token Shop ภายใน Zone";drawOwnProfile();$("zoneMyProfileModal").classList.remove("hidden")};$("closeMyZoneProfile").onclick=()=>$("zoneMyProfileModal").classList.add("hidden");
async function leaveZone(){clearInterval(heartbeat);clearInterval(clockTimer);clearInterval(chatExpiryTimer);try{await updateDoc(doc(db,"zone_positions",uid),{online:false,updatedAt:serverTimestamp()})}catch{}try{await setDoc(doc(db,"presence",uid),{online:false,lastSeenAt:serverTimestamp()},{merge:true})}catch{}if(!isGM()){try{await updateDoc(doc(db,"users",uid),{zone:{zoneId:ZONE_ID,x:Math.round(me.x),y:WALK_Y,direction:me.direction,lastSeenAt:new Date().toISOString()}})}catch{}}}
window.addEventListener("resize",resizeCanvas);window.addEventListener("pagehide",leaveZone);$("leaveZoneButton").addEventListener("click",()=>leaveZone());

onAuthStateChanged(auth,async user=>{
  setBootStep("auth","loading","กำลังตรวจสอบ");if(!user){setBootStep("auth","error","ยังไม่ได้ Login");showGate("กรุณา Login ก่อน","2D Zone ใช้บัญชีที่ Login แล้ว","login");return}uid=user.uid;setBootStep("auth","ok",isGM()?"GM Login":"Login แล้ว");
  const okProfile=await loadProfile();if(!okProfile)return;const allowed=await checkModerationBeforeEntry();if(!allowed)return;blocked=false;$("zoneGate").classList.add("hidden");$("zoneApp").classList.remove("hidden");
  if(isGM()){$("zoneMyStudentId").textContent="GM";$("zoneMyShield").innerHTML=rankShieldHTML(GM_RANK);$("zoneWalletLabel").textContent="🛡️ ROLE";$("zoneTokenBalance").textContent="GAME MASTER";$("openZoneShop").classList.add("hidden");$("openAdminPanel").classList.remove("hidden");$("leaveZoneButton").href="./admin.html";$("zoneChatInput").placeholder="GM พิมพ์ประกาศหรือพูดคุย (ข้อความ GM ไม่หมดอายุ)...";}else{$("zoneMyStudentId").textContent=profile.studentId||"-";$("zoneMyShield").innerHTML=rankShieldHTML(profile.rank);$("zoneTokenBalance").textContent=Number(profile.tokenBalance||0).toLocaleString();}
  startWorldClock();resizeCanvas();listenModeration();listenPositions();listenMessages();clearInterval(chatExpiryTimer);chatExpiryTimer=setInterval(refreshVisibleZoneMessages,60000);await syncPublicProfile();await publishPresence();await publishPosition(true);heartbeat=setInterval(async()=>{await publishPresence();await publishPosition(true)},PRESENCE_HEARTBEAT_MS);requestAnimationFrame(loop);
});

```

---

## firebase-config.js

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyAScKt0szL6-KpA0KqQlROq2v59vBbBrxc",
  authDomain: "thc-nr.firebaseapp.com",
  projectId: "thc-nr",
  storageBucket: "thc-nr.firebasestorage.app",
  messagingSenderId: "839632570247",
  appId: "1:839632570247:web:4c2d2413270df99dd7f522",
  measurementId: "G-LWCNWGSZTS"
};

export const ADMIN_USERNAME = "Pisit_2000";
export const ADMIN_EMAIL = "pisit_2000@thc-nr.local";

export const ADMIN_UID = "TWUrLjOh3BTa1cBNwDXKk4X2IAg1";

```

---

## lessons.js

```javascript
import { HTML_LEVELS } from "./levels-html.js?v=4.3.0";
import { PYTHON_LEVELS } from "./levels-python.js?v=4.3.0";

export const LANGUAGES = [
  {
    id:"html", name:"HTML", icon:"🌐", stageCount:50,
    tagline:"50 ด่าน · โครงสร้างหน้าเว็บ",
    description:"ฝึก HTML จากแท็กพื้นฐานไปจนถึง Semantic Layout และหน้าเว็บที่ซับซ้อน",
    benefit:"สร้างพื้นฐาน Front-End, DOM, Accessibility และโครงสร้างเว็บที่ถูกต้อง"
  },
  {
    id:"python", name:"Python", icon:"🐍", stageCount:50,
    tagline:"50 ด่าน · Logic และ Programming",
    description:"ฝึก Python จากตัวแปรไปจนถึง Class, Generator, Decorator และ Async",
    benefit:"ต่อยอด Algorithm, Automation, Data, AI และ Back-End"
  },
  {
    id:"css", name:"CSS", icon:"🎨", stageCount:0, comingSoon:true,
    tagline:"กำลังเตรียมด่าน", description:"ระบบรองรับการเพิ่ม 50 ด่าน CSS ในเวอร์ชันถัดไป",
    benefit:"โครงสร้างระบบเตรียมพร้อมแล้ว"
  },
  {
    id:"javascript", name:"JavaScript", icon:"⚡", stageCount:0, comingSoon:true,
    tagline:"กำลังเตรียมด่าน", description:"ระบบรองรับการเพิ่ม 50 ด่าน JavaScript ในเวอร์ชันถัดไป",
    benefit:"โครงสร้างระบบเตรียมพร้อมแล้ว"
  }
];

export const DIFFICULTIES = [
  {id:"easy",name:"ง่าย",icon:"🟢",multiplier:1.00,from:1,to:15,description:"ด่าน 1–15 · พื้นฐาน"},
  {id:"medium",name:"ปานกลาง",icon:"🟡",multiplier:1.35,from:16,to:35,description:"ด่าน 16–35 · โครงสร้างมากขึ้น"},
  {id:"hard",name:"ยาก",icon:"🔴",multiplier:1.75,from:36,to:50,description:"ด่าน 36–50 · โค้ดยาวและซับซ้อน"}
];

export const LESSONS = [...HTML_LEVELS, ...PYTHON_LEVELS];

```

---

## levels-html.js

```javascript
export const HTML_LEVELS = [
  {
    "id": "html_01",
    "language": "html",
    "stage": 1,
    "difficulty": "easy",
    "title": "หัวข้อและย่อหน้า",
    "description": "ด่าน HTML 1: หัวข้อและย่อหน้า",
    "usage": "ใช้ h1 เป็นหัวข้อหลักและ p เป็นย่อหน้า",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<h1>Hello HTML</h1>\n<p>เริ่มต้นเรียนรู้ HTML</p>",
    "outputExplain": "ใช้ h1 เป็นหัวข้อหลักและ p เป็นย่อหน้า",
    "basePoints": 110,
    "rewardPoints": 22,
    "timeLimit": 66
  },
  {
    "id": "html_02",
    "language": "html",
    "stage": 2,
    "difficulty": "easy",
    "title": "ตัวหนาและตัวเอียง",
    "description": "ด่าน HTML 2: ตัวหนาและตัวเอียง",
    "usage": "strong เน้นความสำคัญ ส่วน em เน้นข้อความ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>เรียน <strong>HTML</strong> แบบ <em>เข้าใจง่าย</em></p>",
    "outputExplain": "strong เน้นความสำคัญ ส่วน em เน้นข้อความ",
    "basePoints": 120,
    "rewardPoints": 24,
    "timeLimit": 73
  },
  {
    "id": "html_03",
    "language": "html",
    "stage": 3,
    "difficulty": "easy",
    "title": "ลิงก์",
    "description": "ด่าน HTML 3: ลิงก์",
    "usage": "แท็ก a ใช้สร้างลิงก์",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<a href=\"https://example.com\">เปิดเว็บไซต์ตัวอย่าง</a>",
    "outputExplain": "แท็ก a ใช้สร้างลิงก์",
    "basePoints": 130,
    "rewardPoints": 26,
    "timeLimit": 70
  },
  {
    "id": "html_04",
    "language": "html",
    "stage": 4,
    "difficulty": "easy",
    "title": "รูปภาพ",
    "description": "ด่าน HTML 4: รูปภาพ",
    "usage": "img ใช้แสดงรูปและ alt อธิบายรูป",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<img src=\"https://picsum.photos/240/120\" alt=\"ภาพตัวอย่าง\">",
    "outputExplain": "img ใช้แสดงรูปและ alt อธิบายรูป",
    "basePoints": 140,
    "rewardPoints": 28,
    "timeLimit": 74
  },
  {
    "id": "html_05",
    "language": "html",
    "stage": 5,
    "difficulty": "easy",
    "title": "รายการไม่เรียงลำดับ",
    "description": "ด่าน HTML 5: รายการไม่เรียงลำดับ",
    "usage": "ul และ li ใช้สร้างรายการแบบจุด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>",
    "outputExplain": "ul และ li ใช้สร้างรายการแบบจุด",
    "basePoints": 150,
    "rewardPoints": 30,
    "timeLimit": 77
  },
  {
    "id": "html_06",
    "language": "html",
    "stage": 6,
    "difficulty": "easy",
    "title": "รายการเรียงลำดับ",
    "description": "ด่าน HTML 6: รายการเรียงลำดับ",
    "usage": "ol ใช้สร้างรายการมีลำดับ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<ol>\n  <li>วางแผน</li>\n  <li>เขียนโค้ด</li>\n  <li>ทดสอบ</li>\n</ol>",
    "outputExplain": "ol ใช้สร้างรายการมีลำดับ",
    "basePoints": 160,
    "rewardPoints": 32,
    "timeLimit": 79
  },
  {
    "id": "html_07",
    "language": "html",
    "stage": 7,
    "difficulty": "easy",
    "title": "เส้นคั่นและขึ้นบรรทัด",
    "description": "ด่าน HTML 7: เส้นคั่นและขึ้นบรรทัด",
    "usage": "br ขึ้นบรรทัดใหม่และ hr สร้างเส้นแบ่ง",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>บรรทัดแรก<br>บรรทัดที่สอง</p>\n<hr>",
    "outputExplain": "br ขึ้นบรรทัดใหม่และ hr สร้างเส้นแบ่ง",
    "basePoints": 170,
    "rewardPoints": 34,
    "timeLimit": 57
  },
  {
    "id": "html_08",
    "language": "html",
    "stage": 8,
    "difficulty": "easy",
    "title": "กล่อง div",
    "description": "ด่าน HTML 8: กล่อง div",
    "usage": "div ใช้จัดกลุ่มองค์ประกอบ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<div class=\"card\">\n  <h2>Card</h2>\n  <p>เนื้อหาภายในการ์ด</p>\n</div>",
    "outputExplain": "div ใช้จัดกลุ่มองค์ประกอบ",
    "basePoints": 180,
    "rewardPoints": 36,
    "timeLimit": 81
  },
  {
    "id": "html_09",
    "language": "html",
    "stage": 9,
    "difficulty": "easy",
    "title": "span ในข้อความ",
    "description": "ด่าน HTML 9: span ในข้อความ",
    "usage": "span ใช้ครอบข้อความเฉพาะส่วน",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>คะแนน: <span class=\"score\">100</span> แต้ม</p>",
    "outputExplain": "span ใช้ครอบข้อความเฉพาะส่วน",
    "basePoints": 190,
    "rewardPoints": 38,
    "timeLimit": 66
  },
  {
    "id": "html_10",
    "language": "html",
    "stage": 10,
    "difficulty": "easy",
    "title": "ตารางพื้นฐาน",
    "description": "ด่าน HTML 10: ตารางพื้นฐาน",
    "usage": "table, tr, th, td ใช้สร้างตาราง",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<table>\n  <tr><th>ชื่อ</th><th>คะแนน</th></tr>\n  <tr><td>Ann</td><td>90</td></tr>\n</table>",
    "outputExplain": "table, tr, th, td ใช้สร้างตาราง",
    "basePoints": 200,
    "rewardPoints": 40,
    "timeLimit": 97
  },
  {
    "id": "html_11",
    "language": "html",
    "stage": 11,
    "difficulty": "easy",
    "title": "หัวตารางและตัวตาราง",
    "description": "ด่าน HTML 11: หัวตารางและตัวตาราง",
    "usage": "thead และ tbody แยกส่วนหัวและข้อมูล",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<table>\n  <thead><tr><th>วิชา</th><th>เกรด</th></tr></thead>\n  <tbody><tr><td>Programming</td><td>A</td></tr></tbody>\n</table>",
    "outputExplain": "thead และ tbody แยกส่วนหัวและข้อมูล",
    "basePoints": 210,
    "rewardPoints": 42,
    "timeLimit": 124
  },
  {
    "id": "html_12",
    "language": "html",
    "stage": 12,
    "difficulty": "easy",
    "title": "ปุ่ม",
    "description": "ด่าน HTML 12: ปุ่ม",
    "usage": "button ใช้สร้างปุ่ม",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<button type=\"button\">เริ่มเกม</button>",
    "outputExplain": "button ใช้สร้างปุ่ม",
    "basePoints": 220,
    "rewardPoints": 44,
    "timeLimit": 59
  },
  {
    "id": "html_13",
    "language": "html",
    "stage": 13,
    "difficulty": "easy",
    "title": "ช่องข้อความ",
    "description": "ด่าน HTML 13: ช่องข้อความ",
    "usage": "label เชื่อมกับ input เพื่อรับข้อมูล",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"name\">ชื่อ</label>\n<input id=\"name\" type=\"text\">",
    "outputExplain": "label เชื่อมกับ input เพื่อรับข้อมูล",
    "basePoints": 230,
    "rewardPoints": 46,
    "timeLimit": 75
  },
  {
    "id": "html_14",
    "language": "html",
    "stage": 14,
    "difficulty": "easy",
    "title": "ช่องอีเมล",
    "description": "ด่าน HTML 14: ช่องอีเมล",
    "usage": "input email ช่วยตรวจรูปแบบอีเมล",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"email\">อีเมล</label>\n<input id=\"email\" type=\"email\" required>",
    "outputExplain": "input email ช่วยตรวจรูปแบบอีเมล",
    "basePoints": 240,
    "rewardPoints": 48,
    "timeLimit": 84
  },
  {
    "id": "html_15",
    "language": "html",
    "stage": 15,
    "difficulty": "easy",
    "title": "รหัสผ่าน",
    "description": "ด่าน HTML 15: รหัสผ่าน",
    "usage": "password ซ่อนตัวอักษรขณะพิมพ์",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"password\">รหัสผ่าน</label>\n<input id=\"password\" type=\"password\" minlength=\"6\">",
    "outputExplain": "password ซ่อนตัวอักษรขณะพิมพ์",
    "basePoints": 250,
    "rewardPoints": 50,
    "timeLimit": 97
  },
  {
    "id": "html_16",
    "language": "html",
    "stage": 16,
    "difficulty": "medium",
    "title": "ตัวเลือก select",
    "description": "ด่าน HTML 16: ตัวเลือก select",
    "usage": "select และ option สร้างรายการเลือก",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"level\">ระดับ</label>\n<select id=\"level\">\n  <option>ง่าย</option>\n  <option>ปานกลาง</option>\n  <option>ยาก</option>\n</select>",
    "outputExplain": "select และ option สร้างรายการเลือก",
    "basePoints": 260,
    "rewardPoints": 93,
    "timeLimit": 132
  },
  {
    "id": "html_17",
    "language": "html",
    "stage": 17,
    "difficulty": "medium",
    "title": "checkbox",
    "description": "ด่าน HTML 17: checkbox",
    "usage": "checkbox ใช้เลือกค่าแบบเปิด/ปิด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label>\n  <input type=\"checkbox\">\n  ยอมรับเงื่อนไข\n</label>",
    "outputExplain": "checkbox ใช้เลือกค่าแบบเปิด/ปิด",
    "basePoints": 270,
    "rewardPoints": 96,
    "timeLimit": 74
  },
  {
    "id": "html_18",
    "language": "html",
    "stage": 18,
    "difficulty": "medium",
    "title": "radio",
    "description": "ด่าน HTML 18: radio",
    "usage": "radio ใช้เลือกหนึ่งค่าจากกลุ่ม",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label><input type=\"radio\" name=\"mode\"> Classic</label>\n<label><input type=\"radio\" name=\"mode\"> PVP</label>",
    "outputExplain": "radio ใช้เลือกหนึ่งค่าจากกลุ่ม",
    "basePoints": 280,
    "rewardPoints": 99,
    "timeLimit": 110
  },
  {
    "id": "html_19",
    "language": "html",
    "stage": 19,
    "difficulty": "medium",
    "title": "textarea",
    "description": "ด่าน HTML 19: textarea",
    "usage": "textarea ใช้รับข้อความหลายบรรทัด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"note\">หมายเหตุ</label>\n<textarea id=\"note\" rows=\"4\"></textarea>",
    "outputExplain": "textarea ใช้รับข้อความหลายบรรทัด",
    "basePoints": 290,
    "rewardPoints": 102,
    "timeLimit": 86
  },
  {
    "id": "html_20",
    "language": "html",
    "stage": 20,
    "difficulty": "medium",
    "title": "ฟอร์มสมัคร",
    "description": "ด่าน HTML 20: ฟอร์มสมัคร",
    "usage": "form รวมช่องข้อมูลและปุ่มส่ง",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<form>\n  <label for=\"student\">รหัสนักศึกษา</label>\n  <input id=\"student\" required>\n  <button type=\"submit\">สมัคร</button>\n</form>",
    "outputExplain": "form รวมช่องข้อมูลและปุ่มส่ง",
    "basePoints": 300,
    "rewardPoints": 105,
    "timeLimit": 126
  },
  {
    "id": "html_21",
    "language": "html",
    "stage": 21,
    "difficulty": "medium",
    "title": "header",
    "description": "ด่าน HTML 21: header",
    "usage": "header คือส่วนหัวของหน้า/ส่วน",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<header>\n  <h1>Code Typing</h1>\n  <p>ฝึกพิมพ์โค้ดให้แม่นยำ</p>\n</header>",
    "outputExplain": "header คือส่วนหัวของหน้า/ส่วน",
    "basePoints": 310,
    "rewardPoints": 108,
    "timeLimit": 84
  },
  {
    "id": "html_22",
    "language": "html",
    "stage": 22,
    "difficulty": "medium",
    "title": "nav",
    "description": "ด่าน HTML 22: nav",
    "usage": "nav ใช้กับชุดลิงก์นำทาง",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<nav>\n  <a href=\"#home\">หน้าแรก</a>\n  <a href=\"#lesson\">บทเรียน</a>\n  <a href=\"#game\">เกม</a>\n</nav>",
    "outputExplain": "nav ใช้กับชุดลิงก์นำทาง",
    "basePoints": 320,
    "rewardPoints": 111,
    "timeLimit": 105
  },
  {
    "id": "html_23",
    "language": "html",
    "stage": 23,
    "difficulty": "medium",
    "title": "main",
    "description": "ด่าน HTML 23: main",
    "usage": "main ครอบเนื้อหาหลัก",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<main>\n  <h1>บทเรียน HTML</h1>\n  <p>เนื้อหาหลักของหน้า</p>\n</main>",
    "outputExplain": "main ครอบเนื้อหาหลัก",
    "basePoints": 330,
    "rewardPoints": 114,
    "timeLimit": 79
  },
  {
    "id": "html_24",
    "language": "html",
    "stage": 24,
    "difficulty": "medium",
    "title": "section",
    "description": "ด่าน HTML 24: section",
    "usage": "section แบ่งเนื้อหาเป็นหมวด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<section>\n  <h2>บทที่ 1</h2>\n  <p>พื้นฐาน HTML</p>\n</section>",
    "outputExplain": "section แบ่งเนื้อหาเป็นหมวด",
    "basePoints": 340,
    "rewardPoints": 117,
    "timeLimit": 75
  },
  {
    "id": "html_25",
    "language": "html",
    "stage": 25,
    "difficulty": "medium",
    "title": "article",
    "description": "ด่าน HTML 25: article",
    "usage": "article เหมาะกับเนื้อหาอิสระ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<article>\n  <h2>ข่าวการเขียนโปรแกรม</h2>\n  <p>เนื้อหาที่อยู่ได้ด้วยตัวเอง</p>\n</article>",
    "outputExplain": "article เหมาะกับเนื้อหาอิสระ",
    "basePoints": 350,
    "rewardPoints": 120,
    "timeLimit": 96
  },
  {
    "id": "html_26",
    "language": "html",
    "stage": 26,
    "difficulty": "medium",
    "title": "aside",
    "description": "ด่าน HTML 26: aside",
    "usage": "aside คือข้อมูลเสริมจากเนื้อหาหลัก",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<main>\n  <article>เนื้อหาหลัก</article>\n  <aside>คำแนะนำเพิ่มเติม</aside>\n</main>",
    "outputExplain": "aside คือข้อมูลเสริมจากเนื้อหาหลัก",
    "basePoints": 360,
    "rewardPoints": 123,
    "timeLimit": 90
  },
  {
    "id": "html_27",
    "language": "html",
    "stage": 27,
    "difficulty": "medium",
    "title": "footer",
    "description": "ด่าน HTML 27: footer",
    "usage": "footer คือส่วนท้าย",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<footer>\n  <p>© 2026 Code Academy</p>\n</footer>",
    "outputExplain": "footer คือส่วนท้าย",
    "basePoints": 370,
    "rewardPoints": 126,
    "timeLimit": 65
  },
  {
    "id": "html_28",
    "language": "html",
    "stage": 28,
    "difficulty": "medium",
    "title": "figure",
    "description": "ด่าน HTML 28: figure",
    "usage": "figure จัดกลุ่มสื่อกับคำอธิบาย",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<figure>\n  <img src=\"https://picsum.photos/220/100\" alt=\"ตัวอย่าง\">\n  <figcaption>ภาพประกอบบทเรียน</figcaption>\n</figure>",
    "outputExplain": "figure จัดกลุ่มสื่อกับคำอธิบาย",
    "basePoints": 380,
    "rewardPoints": 129,
    "timeLimit": 120
  },
  {
    "id": "html_29",
    "language": "html",
    "stage": 29,
    "difficulty": "medium",
    "title": "details",
    "description": "ด่าน HTML 29: details",
    "usage": "details สร้างส่วนเปิด/ปิด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<details>\n  <summary>ดูคำอธิบาย</summary>\n  <p>HTML คือภาษาสำหรับโครงสร้างเว็บ</p>\n</details>",
    "outputExplain": "details สร้างส่วนเปิด/ปิด",
    "basePoints": 390,
    "rewardPoints": 132,
    "timeLimit": 99
  },
  {
    "id": "html_30",
    "language": "html",
    "stage": 30,
    "difficulty": "medium",
    "title": "progress",
    "description": "ด่าน HTML 30: progress",
    "usage": "progress แสดงความคืบหน้า",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"progress\">ความคืบหน้า</label>\n<progress id=\"progress\" value=\"65\" max=\"100\">65%</progress>",
    "outputExplain": "progress แสดงความคืบหน้า",
    "basePoints": 400,
    "rewardPoints": 135,
    "timeLimit": 105
  },
  {
    "id": "html_31",
    "language": "html",
    "stage": 31,
    "difficulty": "medium",
    "title": "meter",
    "description": "ด่าน HTML 31: meter",
    "usage": "meter แสดงค่าภายในช่วง",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"accuracy\">Accuracy</label>\n<meter id=\"accuracy\" min=\"0\" max=\"100\" value=\"92\">92%</meter>",
    "outputExplain": "meter แสดงค่าภายในช่วง",
    "basePoints": 410,
    "rewardPoints": 138,
    "timeLimit": 105
  },
  {
    "id": "html_32",
    "language": "html",
    "stage": 32,
    "difficulty": "medium",
    "title": "time",
    "description": "ด่าน HTML 32: time",
    "usage": "time ระบุวันเวลาอย่างมีความหมาย",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>เริ่มเรียนวันที่ <time datetime=\"2026-08-12\">12 สิงหาคม 2569</time></p>",
    "outputExplain": "time ระบุวันเวลาอย่างมีความหมาย",
    "basePoints": 420,
    "rewardPoints": 141,
    "timeLimit": 85
  },
  {
    "id": "html_33",
    "language": "html",
    "stage": 33,
    "difficulty": "medium",
    "title": "mark",
    "description": "ด่าน HTML 33: mark",
    "usage": "mark ไฮไลต์ข้อความ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>คำสำคัญคือ <mark>semantic HTML</mark></p>",
    "outputExplain": "mark ไฮไลต์ข้อความ",
    "basePoints": 430,
    "rewardPoints": 144,
    "timeLimit": 63
  },
  {
    "id": "html_34",
    "language": "html",
    "stage": 34,
    "difficulty": "medium",
    "title": "code",
    "description": "ด่าน HTML 34: code",
    "usage": "code ใช้แสดงข้อความโค้ด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<p>ใช้คำสั่ง <code>&lt;h1&gt;</code> เพื่อสร้างหัวข้อ</p>",
    "outputExplain": "code ใช้แสดงข้อความโค้ด",
    "basePoints": 440,
    "rewardPoints": 147,
    "timeLimit": 72
  },
  {
    "id": "html_35",
    "language": "html",
    "stage": 35,
    "difficulty": "medium",
    "title": "pre",
    "description": "ด่าน HTML 35: pre",
    "usage": "pre รักษาช่องว่างและบรรทัด",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<pre><code>&lt;h1&gt;Hello&lt;/h1&gt;\n&lt;p&gt;World&lt;/p&gt;</code></pre>",
    "outputExplain": "pre รักษาช่องว่างและบรรทัด",
    "basePoints": 450,
    "rewardPoints": 150,
    "timeLimit": 86
  },
  {
    "id": "html_36",
    "language": "html",
    "stage": 36,
    "difficulty": "hard",
    "title": "iframe",
    "description": "ด่าน HTML 36: iframe",
    "usage": "iframe ฝังเอกสารอื่น",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<iframe src=\"https://example.com\" title=\"เว็บไซต์ตัวอย่าง\"></iframe>",
    "outputExplain": "iframe ฝังเอกสารอื่น",
    "basePoints": 460,
    "rewardPoints": 244,
    "timeLimit": 81
  },
  {
    "id": "html_37",
    "language": "html",
    "stage": 37,
    "difficulty": "hard",
    "title": "audio",
    "description": "ด่าน HTML 37: audio",
    "usage": "audio ฝังเสียงพร้อม controls",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<audio controls>\n  <source src=\"audio.mp3\" type=\"audio/mpeg\">\n  Browser ไม่รองรับเสียง\n</audio>",
    "outputExplain": "audio ฝังเสียงพร้อม controls",
    "basePoints": 470,
    "rewardPoints": 248,
    "timeLimit": 101
  },
  {
    "id": "html_38",
    "language": "html",
    "stage": 38,
    "difficulty": "hard",
    "title": "video",
    "description": "ด่าน HTML 38: video",
    "usage": "video ฝังวิดีโอ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<video controls width=\"320\">\n  <source src=\"video.mp4\" type=\"video/mp4\">\n  Browser ไม่รองรับวิดีโอ\n</video>",
    "outputExplain": "video ฝังวิดีโอ",
    "basePoints": 480,
    "rewardPoints": 252,
    "timeLimit": 110
  },
  {
    "id": "html_39",
    "language": "html",
    "stage": 39,
    "difficulty": "hard",
    "title": "picture",
    "description": "ด่าน HTML 39: picture",
    "usage": "picture เลือกรูปตามเงื่อนไข",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<picture>\n  <source media=\"(min-width: 800px)\" srcset=\"large.jpg\">\n  <img src=\"small.jpg\" alt=\"Responsive image\">\n</picture>",
    "outputExplain": "picture เลือกรูปตามเงื่อนไข",
    "basePoints": 490,
    "rewardPoints": 256,
    "timeLimit": 123
  },
  {
    "id": "html_40",
    "language": "html",
    "stage": 40,
    "difficulty": "hard",
    "title": "data attributes",
    "description": "ด่าน HTML 40: data attributes",
    "usage": "data-* เก็บข้อมูลเพิ่มเติมบน element",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<button data-level=\"10\" data-mode=\"classic\">เล่น Level 10</button>",
    "outputExplain": "data-* เก็บข้อมูลเพิ่มเติมบน element",
    "basePoints": 500,
    "rewardPoints": 260,
    "timeLimit": 79
  },
  {
    "id": "html_41",
    "language": "html",
    "stage": 41,
    "difficulty": "hard",
    "title": "ARIA label",
    "description": "ด่าน HTML 41: ARIA label",
    "usage": "aria-label ช่วย Screen Reader",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<button aria-label=\"ปิดหน้าต่าง\">×</button>",
    "outputExplain": "aria-label ช่วย Screen Reader",
    "basePoints": 510,
    "rewardPoints": 264,
    "timeLimit": 62
  },
  {
    "id": "html_42",
    "language": "html",
    "stage": 42,
    "difficulty": "hard",
    "title": "fieldset",
    "description": "ด่าน HTML 42: fieldset",
    "usage": "fieldset จัดกลุ่มช่องฟอร์ม",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<form>\n  <fieldset>\n    <legend>ข้อมูลผู้เล่น</legend>\n    <label>ชื่อ <input type=\"text\"></label>\n  </fieldset>\n</form>",
    "outputExplain": "fieldset จัดกลุ่มช่องฟอร์ม",
    "basePoints": 520,
    "rewardPoints": 268,
    "timeLimit": 120
  },
  {
    "id": "html_43",
    "language": "html",
    "stage": 43,
    "difficulty": "hard",
    "title": "datalist",
    "description": "ด่าน HTML 43: datalist",
    "usage": "datalist ให้คำแนะนำใน input",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<label for=\"lang\">ภาษา</label>\n<input id=\"lang\" list=\"languages\">\n<datalist id=\"languages\">\n  <option value=\"HTML\">\n  <option value=\"Python\">\n</datalist>",
    "outputExplain": "datalist ให้คำแนะนำใน input",
    "basePoints": 530,
    "rewardPoints": 272,
    "timeLimit": 144
  },
  {
    "id": "html_44",
    "language": "html",
    "stage": 44,
    "difficulty": "hard",
    "title": "output",
    "description": "ด่าน HTML 44: output",
    "usage": "output แสดงผลการคำนวณ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<form oninput=\"result.value=Number(a.value)+Number(b.value)\">\n  <input id=\"a\" type=\"number\" value=\"2\"> +\n  <input id=\"b\" type=\"number\" value=\"3\"> =\n  <output name=\"result\">5</output>\n</form>",
    "outputExplain": "output แสดงผลการคำนวณ",
    "basePoints": 540,
    "rewardPoints": 276,
    "timeLimit": 172
  },
  {
    "id": "html_45",
    "language": "html",
    "stage": 45,
    "difficulty": "hard",
    "title": "template",
    "description": "ด่าน HTML 45: template",
    "usage": "template เก็บ markup ที่ยังไม่ render",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<template id=\"cardTemplate\">\n  <article class=\"card\">\n    <h2>Template Card</h2>\n  </article>\n</template>",
    "outputExplain": "template เก็บ markup ที่ยังไม่ render",
    "basePoints": 550,
    "rewardPoints": 280,
    "timeLimit": 108
  },
  {
    "id": "html_46",
    "language": "html",
    "stage": 46,
    "difficulty": "hard",
    "title": "dialog",
    "description": "ด่าน HTML 46: dialog",
    "usage": "dialog ใช้สร้างกล่องโต้ตอบ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<dialog open>\n  <h2>Level Complete</h2>\n  <p>คุณผ่านด่านแล้ว</p>\n  <button>ตกลง</button>\n</dialog>",
    "outputExplain": "dialog ใช้สร้างกล่องโต้ตอบ",
    "basePoints": 560,
    "rewardPoints": 284,
    "timeLimit": 103
  },
  {
    "id": "html_47",
    "language": "html",
    "stage": 47,
    "difficulty": "hard",
    "title": "meta viewport",
    "description": "ด่าน HTML 47: meta viewport",
    "usage": "meta viewport ทำให้หน้าเว็บรองรับมือถือ",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Responsive Page</title>\n</head>\n<body>\n  <h1>Responsive HTML</h1>\n</body>\n</html>",
    "outputExplain": "meta viewport ทำให้หน้าเว็บรองรับมือถือ",
    "basePoints": 570,
    "rewardPoints": 288,
    "timeLimit": 193
  },
  {
    "id": "html_48",
    "language": "html",
    "stage": 48,
    "difficulty": "hard",
    "title": "หน้า Profile",
    "description": "ด่าน HTML 48: หน้า Profile",
    "usage": "รวม semantic elements เป็นหน้าโปรไฟล์",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<main>\n  <article class=\"profile\">\n    <img src=\"avatar.png\" alt=\"รูปผู้เล่น\">\n    <h1>Pisit</h1>\n    <p>Level 25 · 2,450 Points</p>\n    <button>แก้ไขตัวละคร</button>\n  </article>\n</main>",
    "outputExplain": "รวม semantic elements เป็นหน้าโปรไฟล์",
    "basePoints": 580,
    "rewardPoints": 292,
    "timeLimit": 170
  },
  {
    "id": "html_49",
    "language": "html",
    "stage": 49,
    "difficulty": "hard",
    "title": "หน้า Dashboard",
    "description": "ด่าน HTML 49: หน้า Dashboard",
    "usage": "รวมองค์ประกอบเป็น Dashboard",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<header><h1>Student Dashboard</h1></header>\n<main>\n  <section>\n    <h2>สถิติ</h2>\n    <ul>\n      <li>WPM: 52</li>\n      <li>Accuracy: 98%</li>\n      <li>Points: 3200</li>\n    </ul>\n  </section>\n</main>",
    "outputExplain": "รวมองค์ประกอบเป็น Dashboard",
    "basePoints": 590,
    "rewardPoints": 296,
    "timeLimit": 180
  },
  {
    "id": "html_50",
    "language": "html",
    "stage": 50,
    "difficulty": "hard",
    "title": "หน้าเกม Semantic",
    "description": "ด่าน HTML 50: หน้าเกม Semantic",
    "usage": "ด่านสุดท้ายรวมโครงสร้าง HTML5 หลายส่วน",
    "benefit": "ฝึกอ่านและพิมพ์โครงสร้าง HTML ให้แม่นยำ พร้อมเข้าใจหน้าที่ของแท็ก",
    "code": "<!DOCTYPE html>\n<html lang=\"th\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Code Typing Arena</title>\n</head>\n<body>\n  <header>\n    <h1>Code Typing Arena</h1>\n    <nav><a href=\"#classic\">Classic</a> <a href=\"#pvp\">PVP</a></nav>\n  </header>\n  <main>\n    <section id=\"classic\">\n      <h2>Classic Mode</h2>\n      <p>พิมพ์โค้ดให้ถูกต้องและเร็วที่สุด</p>\n      <button type=\"button\">เริ่มเกม</button>\n    </section>\n  </main>\n  <footer>© 2026 Nangrong Technical College</footer>\n</body>\n</html>",
    "outputExplain": "ด่านสุดท้ายรวมโครงสร้าง HTML5 หลายส่วน",
    "basePoints": 600,
    "rewardPoints": 300,
    "timeLimit": 300
  }
];

```

---

## levels-python.js

```javascript
export const PYTHON_LEVELS = [
  {
    "id": "python_01",
    "language": "python",
    "stage": 1,
    "difficulty": "easy",
    "title": "print พื้นฐาน",
    "description": "ด่าน Python 1: print พื้นฐาน",
    "usage": "แสดงข้อความ Hello Python",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "print(\"Hello Python\")",
    "outputExplain": "แสดงข้อความ Hello Python",
    "output": "แสดงข้อความ Hello Python",
    "basePoints": 112,
    "rewardPoints": 22,
    "timeLimit": 45
  },
  {
    "id": "python_02",
    "language": "python",
    "stage": 2,
    "difficulty": "easy",
    "title": "ตัวแปรข้อความ",
    "description": "ด่าน Python 2: ตัวแปรข้อความ",
    "usage": "เก็บข้อความในตัวแปรแล้วแสดงผล",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "name = \"Pisit\"\nprint(name)",
    "outputExplain": "เก็บข้อความในตัวแปรแล้วแสดงผล",
    "output": "เก็บข้อความในตัวแปรแล้วแสดงผล",
    "basePoints": 124,
    "rewardPoints": 24,
    "timeLimit": 49
  },
  {
    "id": "python_03",
    "language": "python",
    "stage": 3,
    "difficulty": "easy",
    "title": "ตัวแปรตัวเลข",
    "description": "ด่าน Python 3: ตัวแปรตัวเลข",
    "usage": "เก็บจำนวนเต็มและแสดงผล",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "score = 95\nprint(score)",
    "outputExplain": "เก็บจำนวนเต็มและแสดงผล",
    "output": "เก็บจำนวนเต็มและแสดงผล",
    "basePoints": 136,
    "rewardPoints": 26,
    "timeLimit": 47
  },
  {
    "id": "python_04",
    "language": "python",
    "stage": 4,
    "difficulty": "easy",
    "title": "บวกเลข",
    "description": "ด่าน Python 4: บวกเลข",
    "usage": "คำนวณผลบวก",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "a = 12\nb = 8\nprint(a + b)",
    "outputExplain": "คำนวณผลบวก",
    "output": "คำนวณผลบวก",
    "basePoints": 148,
    "rewardPoints": 28,
    "timeLimit": 48
  },
  {
    "id": "python_05",
    "language": "python",
    "stage": 5,
    "difficulty": "easy",
    "title": "คำนวณหลายตัวดำเนินการ",
    "description": "ด่าน Python 5: คำนวณหลายตัวดำเนินการ",
    "usage": "คำนวณราคารวม",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "price = 120\nqty = 3\ntotal = price * qty\nprint(total)",
    "outputExplain": "คำนวณราคารวม",
    "output": "คำนวณราคารวม",
    "basePoints": 160,
    "rewardPoints": 30,
    "timeLimit": 69
  },
  {
    "id": "python_06",
    "language": "python",
    "stage": 6,
    "difficulty": "easy",
    "title": "รับข้อความแนวคิด",
    "description": "ด่าน Python 6: รับข้อความแนวคิด",
    "usage": "แสดงหลายค่าในบรรทัดเดียว",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "student = \"Somchai\"\nlevel = \"ปวช.1\"\nprint(student, level)",
    "outputExplain": "แสดงหลายค่าในบรรทัดเดียว",
    "output": "แสดงหลายค่าในบรรทัดเดียว",
    "basePoints": 172,
    "rewardPoints": 32,
    "timeLimit": 72
  },
  {
    "id": "python_07",
    "language": "python",
    "stage": 7,
    "difficulty": "easy",
    "title": "f-string",
    "description": "ด่าน Python 7: f-string",
    "usage": "แทรกตัวแปรในข้อความด้วย f-string",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "name = \"Ann\"\nscore = 88\nprint(f\"{name}: {score}\")",
    "outputExplain": "แทรกตัวแปรในข้อความด้วย f-string",
    "output": "แทรกตัวแปรในข้อความด้วย f-string",
    "basePoints": 184,
    "rewardPoints": 34,
    "timeLimit": 66
  },
  {
    "id": "python_08",
    "language": "python",
    "stage": 8,
    "difficulty": "easy",
    "title": "boolean",
    "description": "ด่าน Python 8: boolean",
    "usage": "เก็บค่า True/False",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "is_ready = True\nprint(is_ready)",
    "outputExplain": "เก็บค่า True/False",
    "output": "เก็บค่า True/False",
    "basePoints": 196,
    "rewardPoints": 36,
    "timeLimit": 53
  },
  {
    "id": "python_09",
    "language": "python",
    "stage": 9,
    "difficulty": "easy",
    "title": "if พื้นฐาน",
    "description": "ด่าน Python 9: if พื้นฐาน",
    "usage": "ตรวจเงื่อนไข",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "score = 70\nif score >= 50:\n    print(\"Pass\")",
    "outputExplain": "ตรวจเงื่อนไข",
    "output": "ตรวจเงื่อนไข",
    "basePoints": 208,
    "rewardPoints": 38,
    "timeLimit": 63
  },
  {
    "id": "python_10",
    "language": "python",
    "stage": 10,
    "difficulty": "easy",
    "title": "if else",
    "description": "ด่าน Python 10: if else",
    "usage": "เลือกผลลัพธ์สองทาง",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "score = 45\nif score >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Try again\")",
    "outputExplain": "เลือกผลลัพธ์สองทาง",
    "output": "เลือกผลลัพธ์สองทาง",
    "basePoints": 220,
    "rewardPoints": 40,
    "timeLimit": 84
  },
  {
    "id": "python_11",
    "language": "python",
    "stage": 11,
    "difficulty": "easy",
    "title": "if elif else",
    "description": "ด่าน Python 11: if elif else",
    "usage": "ตรวจหลายช่วงคะแนน",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "score = 82\nif score >= 80:\n    print(\"A\")\nelif score >= 70:\n    print(\"B\")\nelse:\n    print(\"C\")",
    "outputExplain": "ตรวจหลายช่วงคะแนน",
    "output": "ตรวจหลายช่วงคะแนน",
    "basePoints": 232,
    "rewardPoints": 42,
    "timeLimit": 101
  },
  {
    "id": "python_12",
    "language": "python",
    "stage": 12,
    "difficulty": "easy",
    "title": "and operator",
    "description": "ด่าน Python 12: and operator",
    "usage": "รวมสองเงื่อนไขด้วย and",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "age = 18\nhas_card = True\nif age >= 18 and has_card:\n    print(\"Allowed\")",
    "outputExplain": "รวมสองเงื่อนไขด้วย and",
    "output": "รวมสองเงื่อนไขด้วย and",
    "basePoints": 244,
    "rewardPoints": 44,
    "timeLimit": 84
  },
  {
    "id": "python_13",
    "language": "python",
    "stage": 13,
    "difficulty": "easy",
    "title": "or operator",
    "description": "ด่าน Python 13: or operator",
    "usage": "ใช้ or เมื่อผ่านได้อย่างใดอย่างหนึ่ง",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "role = \"teacher\"\nif role == \"admin\" or role == \"teacher\":\n    print(\"Access\")",
    "outputExplain": "ใช้ or เมื่อผ่านได้อย่างใดอย่างหนึ่ง",
    "output": "ใช้ or เมื่อผ่านได้อย่างใดอย่างหนึ่ง",
    "basePoints": 256,
    "rewardPoints": 46,
    "timeLimit": 87
  },
  {
    "id": "python_14",
    "language": "python",
    "stage": 14,
    "difficulty": "easy",
    "title": "list",
    "description": "ด่าน Python 14: list",
    "usage": "สร้าง list",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "languages = [\"HTML\", \"CSS\", \"Python\"]\nprint(languages)",
    "outputExplain": "สร้าง list",
    "output": "สร้าง list",
    "basePoints": 268,
    "rewardPoints": 48,
    "timeLimit": 70
  },
  {
    "id": "python_15",
    "language": "python",
    "stage": 15,
    "difficulty": "easy",
    "title": "index list",
    "description": "ด่าน Python 15: index list",
    "usage": "เข้าถึงสมาชิกด้วย index",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "languages = [\"HTML\", \"CSS\", \"Python\"]\nprint(languages[0])",
    "outputExplain": "เข้าถึงสมาชิกด้วย index",
    "output": "เข้าถึงสมาชิกด้วย index",
    "basePoints": 280,
    "rewardPoints": 50,
    "timeLimit": 72
  },
  {
    "id": "python_16",
    "language": "python",
    "stage": 16,
    "difficulty": "medium",
    "title": "append list",
    "description": "ด่าน Python 16: append list",
    "usage": "เพิ่มสมาชิก list",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "scores = [70, 80]\nscores.append(90)\nprint(scores)",
    "outputExplain": "เพิ่มสมาชิก list",
    "output": "เพิ่มสมาชิก list",
    "basePoints": 292,
    "rewardPoints": 93,
    "timeLimit": 66
  },
  {
    "id": "python_17",
    "language": "python",
    "stage": 17,
    "difficulty": "medium",
    "title": "for loop",
    "description": "ด่าน Python 17: for loop",
    "usage": "วนซ้ำสมาชิก",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "for number in [1, 2, 3]:\n    print(number)",
    "outputExplain": "วนซ้ำสมาชิก",
    "output": "วนซ้ำสมาชิก",
    "basePoints": 304,
    "rewardPoints": 96,
    "timeLimit": 61
  },
  {
    "id": "python_18",
    "language": "python",
    "stage": 18,
    "difficulty": "medium",
    "title": "range",
    "description": "ด่าน Python 18: range",
    "usage": "วนซ้ำช่วงตัวเลข",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "for i in range(5):\n    print(i)",
    "outputExplain": "วนซ้ำช่วงตัวเลข",
    "output": "วนซ้ำช่วงตัวเลข",
    "basePoints": 316,
    "rewardPoints": 99,
    "timeLimit": 53
  },
  {
    "id": "python_19",
    "language": "python",
    "stage": 19,
    "difficulty": "medium",
    "title": "while loop",
    "description": "ด่าน Python 19: while loop",
    "usage": "วนซ้ำด้วย while",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
    "outputExplain": "วนซ้ำด้วย while",
    "output": "วนซ้ำด้วย while",
    "basePoints": 328,
    "rewardPoints": 102,
    "timeLimit": 74
  },
  {
    "id": "python_20",
    "language": "python",
    "stage": 20,
    "difficulty": "medium",
    "title": "break",
    "description": "ด่าน Python 20: break",
    "usage": "หยุด loop ด้วย break",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "for i in range(10):\n    if i == 5:\n        break\n    print(i)",
    "outputExplain": "หยุด loop ด้วย break",
    "output": "หยุด loop ด้วย break",
    "basePoints": 340,
    "rewardPoints": 105,
    "timeLimit": 75
  },
  {
    "id": "python_21",
    "language": "python",
    "stage": 21,
    "difficulty": "medium",
    "title": "continue",
    "description": "ด่าน Python 21: continue",
    "usage": "ข้ามรอบด้วย continue",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "for i in range(6):\n    if i == 3:\n        continue\n    print(i)",
    "outputExplain": "ข้ามรอบด้วย continue",
    "output": "ข้ามรอบด้วย continue",
    "basePoints": 352,
    "rewardPoints": 108,
    "timeLimit": 77
  },
  {
    "id": "python_22",
    "language": "python",
    "stage": 22,
    "difficulty": "medium",
    "title": "function",
    "description": "ด่าน Python 22: function",
    "usage": "สร้างและเรียกฟังก์ชัน",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def greet():\n    print(\"Hello\")\n\ngreet()",
    "outputExplain": "สร้างและเรียกฟังก์ชัน",
    "output": "สร้างและเรียกฟังก์ชัน",
    "basePoints": 364,
    "rewardPoints": 111,
    "timeLimit": 60
  },
  {
    "id": "python_23",
    "language": "python",
    "stage": 23,
    "difficulty": "medium",
    "title": "function parameter",
    "description": "ด่าน Python 23: function parameter",
    "usage": "ส่ง parameter เข้าฟังก์ชัน",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def greet(name):\n    print(f\"Hello {name}\")\n\ngreet(\"Pisit\")",
    "outputExplain": "ส่ง parameter เข้าฟังก์ชัน",
    "output": "ส่ง parameter เข้าฟังก์ชัน",
    "basePoints": 376,
    "rewardPoints": 114,
    "timeLimit": 74
  },
  {
    "id": "python_24",
    "language": "python",
    "stage": 24,
    "difficulty": "medium",
    "title": "return",
    "description": "ด่าน Python 24: return",
    "usage": "คืนค่าจากฟังก์ชัน",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def add(a, b):\n    return a + b\n\nresult = add(4, 6)\nprint(result)",
    "outputExplain": "คืนค่าจากฟังก์ชัน",
    "output": "คืนค่าจากฟังก์ชัน",
    "basePoints": 388,
    "rewardPoints": 117,
    "timeLimit": 78
  },
  {
    "id": "python_25",
    "language": "python",
    "stage": 25,
    "difficulty": "medium",
    "title": "default parameter",
    "description": "ด่าน Python 25: default parameter",
    "usage": "กำหนดค่าเริ่มต้น parameter",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def greet(name=\"Student\"):\n    print(f\"Hello {name}\")\n\ngreet()\ngreet(\"Ann\")",
    "outputExplain": "กำหนดค่าเริ่มต้น parameter",
    "output": "กำหนดค่าเริ่มต้น parameter",
    "basePoints": 400,
    "rewardPoints": 120,
    "timeLimit": 86
  },
  {
    "id": "python_26",
    "language": "python",
    "stage": 26,
    "difficulty": "medium",
    "title": "tuple",
    "description": "ด่าน Python 26: tuple",
    "usage": "ใช้ tuple เก็บค่าคงรูป",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "point = (10, 20)\nprint(point[0], point[1])",
    "outputExplain": "ใช้ tuple เก็บค่าคงรูป",
    "output": "ใช้ tuple เก็บค่าคงรูป",
    "basePoints": 412,
    "rewardPoints": 123,
    "timeLimit": 61
  },
  {
    "id": "python_27",
    "language": "python",
    "stage": 27,
    "difficulty": "medium",
    "title": "set",
    "description": "ด่าน Python 27: set",
    "usage": "set ตัดค่าซ้ำ",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "skills = {\"HTML\", \"Python\", \"HTML\"}\nprint(skills)",
    "outputExplain": "set ตัดค่าซ้ำ",
    "output": "set ตัดค่าซ้ำ",
    "basePoints": 424,
    "rewardPoints": 126,
    "timeLimit": 66
  },
  {
    "id": "python_28",
    "language": "python",
    "stage": 28,
    "difficulty": "medium",
    "title": "dictionary",
    "description": "ด่าน Python 28: dictionary",
    "usage": "เก็บข้อมูลแบบ key-value",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "student = {\"name\": \"Ann\", \"score\": 90}\nprint(student[\"name\"])",
    "outputExplain": "เก็บข้อมูลแบบ key-value",
    "output": "เก็บข้อมูลแบบ key-value",
    "basePoints": 436,
    "rewardPoints": 129,
    "timeLimit": 75
  },
  {
    "id": "python_29",
    "language": "python",
    "stage": 29,
    "difficulty": "medium",
    "title": "dictionary loop",
    "description": "ด่าน Python 29: dictionary loop",
    "usage": "วน dictionary",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "scores = {\"Ann\": 80, \"Boy\": 70}\nfor name, score in scores.items():\n    print(name, score)",
    "outputExplain": "วน dictionary",
    "output": "วน dictionary",
    "basePoints": 448,
    "rewardPoints": 132,
    "timeLimit": 96
  },
  {
    "id": "python_30",
    "language": "python",
    "stage": 30,
    "difficulty": "medium",
    "title": "list comprehension",
    "description": "ด่าน Python 30: list comprehension",
    "usage": "สร้าง list แบบย่อ",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "squares = [n * n for n in range(1, 6)]\nprint(squares)",
    "outputExplain": "สร้าง list แบบย่อ",
    "output": "สร้าง list แบบย่อ",
    "basePoints": 460,
    "rewardPoints": 135,
    "timeLimit": 69
  },
  {
    "id": "python_31",
    "language": "python",
    "stage": 31,
    "difficulty": "medium",
    "title": "filter comprehension",
    "description": "ด่าน Python 31: filter comprehension",
    "usage": "กรองข้อมูลด้วย comprehension",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "scores = [40, 55, 72, 90]\npassed = [s for s in scores if s >= 50]\nprint(passed)",
    "outputExplain": "กรองข้อมูลด้วย comprehension",
    "output": "กรองข้อมูลด้วย comprehension",
    "basePoints": 472,
    "rewardPoints": 138,
    "timeLimit": 89
  },
  {
    "id": "python_32",
    "language": "python",
    "stage": 32,
    "difficulty": "medium",
    "title": "string methods",
    "description": "ด่าน Python 32: string methods",
    "usage": "ใช้ method ของ string",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "text = \"  Python Game  \"\nprint(text.strip().upper())",
    "outputExplain": "ใช้ method ของ string",
    "output": "ใช้ method ของ string",
    "basePoints": 484,
    "rewardPoints": 141,
    "timeLimit": 69
  },
  {
    "id": "python_33",
    "language": "python",
    "stage": 33,
    "difficulty": "medium",
    "title": "split join",
    "description": "ด่าน Python 33: split join",
    "usage": "แยกและรวมข้อความ",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "text = \"HTML,CSS,Python\"\nitems = text.split(\",\")\nprint(\" | \".join(items))",
    "outputExplain": "แยกและรวมข้อความ",
    "output": "แยกและรวมข้อความ",
    "basePoints": 496,
    "rewardPoints": 144,
    "timeLimit": 84
  },
  {
    "id": "python_34",
    "language": "python",
    "stage": 34,
    "difficulty": "medium",
    "title": "enumerate",
    "description": "ด่าน Python 34: enumerate",
    "usage": "วนพร้อมเลขลำดับ",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "languages = [\"HTML\", \"CSS\", \"Python\"]\nfor index, lang in enumerate(languages, start=1):\n    print(index, lang)",
    "outputExplain": "วนพร้อมเลขลำดับ",
    "output": "วนพร้อมเลขลำดับ",
    "basePoints": 508,
    "rewardPoints": 147,
    "timeLimit": 112
  },
  {
    "id": "python_35",
    "language": "python",
    "stage": 35,
    "difficulty": "medium",
    "title": "zip",
    "description": "ด่าน Python 35: zip",
    "usage": "จับคู่หลาย list",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "names = [\"Ann\", \"Boy\"]\nscores = [90, 75]\nfor name, score in zip(names, scores):\n    print(name, score)",
    "outputExplain": "จับคู่หลาย list",
    "output": "จับคู่หลาย list",
    "basePoints": 520,
    "rewardPoints": 150,
    "timeLimit": 106
  },
  {
    "id": "python_36",
    "language": "python",
    "stage": 36,
    "difficulty": "hard",
    "title": "try except",
    "description": "ด่าน Python 36: try except",
    "usage": "จัดการข้อผิดพลาด",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "try:\n    number = int(\"abc\")\nexcept ValueError:\n    print(\"Invalid number\")",
    "outputExplain": "จัดการข้อผิดพลาด",
    "output": "จัดการข้อผิดพลาด",
    "basePoints": 532,
    "rewardPoints": 244,
    "timeLimit": 86
  },
  {
    "id": "python_37",
    "language": "python",
    "stage": 37,
    "difficulty": "hard",
    "title": "raise",
    "description": "ด่าน Python 37: raise",
    "usage": "สร้าง error เมื่อข้อมูลไม่ถูกต้อง",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def check_score(score):\n    if score < 0:\n        raise ValueError(\"Score must be positive\")\n    return score\n\nprint(check_score(80))",
    "outputExplain": "สร้าง error เมื่อข้อมูลไม่ถูกต้อง",
    "output": "สร้าง error เมื่อข้อมูลไม่ถูกต้อง",
    "basePoints": 544,
    "rewardPoints": 248,
    "timeLimit": 129
  },
  {
    "id": "python_38",
    "language": "python",
    "stage": 38,
    "difficulty": "hard",
    "title": "class พื้นฐาน",
    "description": "ด่าน Python 38: class พื้นฐาน",
    "usage": "สร้าง class และ object",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class Student:\n    pass\n\nstudent = Student()\nprint(type(student).__name__)",
    "outputExplain": "สร้าง class และ object",
    "output": "สร้าง class และ object",
    "basePoints": 556,
    "rewardPoints": 252,
    "timeLimit": 85
  },
  {
    "id": "python_39",
    "language": "python",
    "stage": 39,
    "difficulty": "hard",
    "title": "constructor",
    "description": "ด่าน Python 39: constructor",
    "usage": "ใช้ __init__ กำหนดค่า object",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class Student:\n    def __init__(self, name):\n        self.name = name\n\nstudent = Student(\"Ann\")\nprint(student.name)",
    "outputExplain": "ใช้ __init__ กำหนดค่า object",
    "output": "ใช้ __init__ กำหนดค่า object",
    "basePoints": 568,
    "rewardPoints": 256,
    "timeLimit": 116
  },
  {
    "id": "python_40",
    "language": "python",
    "stage": 40,
    "difficulty": "hard",
    "title": "method",
    "description": "ด่าน Python 40: method",
    "usage": "สร้าง method ภายใน class",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def add(self):\n        self.value += 1\n\ncounter = Counter()\ncounter.add()\nprint(counter.value)",
    "outputExplain": "สร้าง method ภายใน class",
    "output": "สร้าง method ภายใน class",
    "basePoints": 580,
    "rewardPoints": 260,
    "timeLimit": 150
  },
  {
    "id": "python_41",
    "language": "python",
    "stage": 41,
    "difficulty": "hard",
    "title": "inheritance",
    "description": "ด่าน Python 41: inheritance",
    "usage": "สืบทอด class",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class Player:\n    def move(self):\n        print(\"Move\")\n\nclass Coder(Player):\n    def type_code(self):\n        print(\"Typing\")\n\ncoder = Coder()\ncoder.move()\ncoder.type_code()",
    "outputExplain": "สืบทอด class",
    "output": "สืบทอด class",
    "basePoints": 592,
    "rewardPoints": 264,
    "timeLimit": 160
  },
  {
    "id": "python_42",
    "language": "python",
    "stage": 42,
    "difficulty": "hard",
    "title": "property",
    "description": "ด่าน Python 42: property",
    "usage": "ใช้ property",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class Player:\n    def __init__(self, score):\n        self._score = score\n\n    @property\n    def score(self):\n        return self._score\n\nplayer = Player(100)\nprint(player.score)",
    "outputExplain": "ใช้ property",
    "output": "ใช้ property",
    "basePoints": 604,
    "rewardPoints": 268,
    "timeLimit": 162
  },
  {
    "id": "python_43",
    "language": "python",
    "stage": 43,
    "difficulty": "hard",
    "title": "lambda",
    "description": "ด่าน Python 43: lambda",
    "usage": "ใช้ lambda ฟังก์ชันสั้น",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "numbers = [3, 1, 2]\nnumbers.sort(key=lambda n: n)\nprint(numbers)",
    "outputExplain": "ใช้ lambda ฟังก์ชันสั้น",
    "output": "ใช้ lambda ฟังก์ชันสั้น",
    "basePoints": 616,
    "rewardPoints": 272,
    "timeLimit": 78
  },
  {
    "id": "python_44",
    "language": "python",
    "stage": 44,
    "difficulty": "hard",
    "title": "map",
    "description": "ด่าน Python 44: map",
    "usage": "แปลงข้อมูลด้วย map",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "numbers = [1, 2, 3]\ndoubled = list(map(lambda n: n * 2, numbers))\nprint(doubled)",
    "outputExplain": "แปลงข้อมูลด้วย map",
    "output": "แปลงข้อมูลด้วย map",
    "basePoints": 628,
    "rewardPoints": 276,
    "timeLimit": 90
  },
  {
    "id": "python_45",
    "language": "python",
    "stage": 45,
    "difficulty": "hard",
    "title": "generator",
    "description": "ด่าน Python 45: generator",
    "usage": "สร้าง generator ด้วย yield",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor value in countdown(3):\n    print(value)",
    "outputExplain": "สร้าง generator ด้วย yield",
    "output": "สร้าง generator ด้วย yield",
    "basePoints": 640,
    "rewardPoints": 280,
    "timeLimit": 112
  },
  {
    "id": "python_46",
    "language": "python",
    "stage": 46,
    "difficulty": "hard",
    "title": "decorator",
    "description": "ด่าน Python 46: decorator",
    "usage": "ใช้ decorator ครอบฟังก์ชัน",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def logger(func):\n    def wrapper():\n        print(\"Start\")\n        func()\n        print(\"End\")\n    return wrapper\n\n@logger\ndef play():\n    print(\"Playing\")\n\nplay()",
    "outputExplain": "ใช้ decorator ครอบฟังก์ชัน",
    "output": "ใช้ decorator ครอบฟังก์ชัน",
    "basePoints": 652,
    "rewardPoints": 284,
    "timeLimit": 153
  },
  {
    "id": "python_47",
    "language": "python",
    "stage": 47,
    "difficulty": "hard",
    "title": "dataclass",
    "description": "ด่าน Python 47: dataclass",
    "usage": "ใช้ dataclass ลด boilerplate",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "from dataclasses import dataclass\n\n@dataclass\nclass Player:\n    name: str\n    score: int\n\nplayer = Player(\"Ann\", 120)\nprint(player)",
    "outputExplain": "ใช้ dataclass ลด boilerplate",
    "output": "ใช้ dataclass ลด boilerplate",
    "basePoints": 664,
    "rewardPoints": 288,
    "timeLimit": 128
  },
  {
    "id": "python_48",
    "language": "python",
    "stage": 48,
    "difficulty": "hard",
    "title": "type hints",
    "description": "ด่าน Python 48: type hints",
    "usage": "ใช้ type hints",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "def average(scores: list[int]) -> float:\n    return sum(scores) / len(scores)\n\nprint(average([80, 90, 100]))",
    "outputExplain": "ใช้ type hints",
    "output": "ใช้ type hints",
    "basePoints": 676,
    "rewardPoints": 292,
    "timeLimit": 111
  },
  {
    "id": "python_49",
    "language": "python",
    "stage": 49,
    "difficulty": "hard",
    "title": "async function",
    "description": "ด่าน Python 49: async function",
    "usage": "รู้จัก async/await",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "import asyncio\n\nasync def load_data():\n    await asyncio.sleep(0.1)\n    return \"ready\"\n\nprint(asyncio.run(load_data()))",
    "outputExplain": "รู้จัก async/await",
    "output": "รู้จัก async/await",
    "basePoints": 688,
    "rewardPoints": 296,
    "timeLimit": 119
  },
  {
    "id": "python_50",
    "language": "python",
    "stage": 50,
    "difficulty": "hard",
    "title": "Mini Game Logic",
    "description": "ด่าน Python 50: Mini Game Logic",
    "usage": "ด่านสุดท้ายจำลอง logic เกมตรวจตัวอักษร",
    "benefit": "ฝึกไวยากรณ์ Python และการอ่านโค้ดแบบไต่ระดับ",
    "code": "class TypingGame:\n    def __init__(self, target):\n        self.target = target\n        self.position = 0\n        self.mistakes = 0\n\n    def type_char(self, char):\n        expected = self.target[self.position]\n        if char == expected:\n            self.position += 1\n            return True\n        self.mistakes += 1\n        return False\n\n    def completed(self):\n        return self.position == len(self.target)\n\ngame = TypingGame(\"code\")\nfor char in \"code\":\n    game.type_char(char)\n\nprint(game.completed(), game.mistakes)",
    "outputExplain": "ด่านสุดท้ายจำลอง logic เกมตรวจตัวอักษร",
    "output": "ด่านสุดท้ายจำลอง logic เกมตรวจตัวอักษร",
    "basePoints": 700,
    "rewardPoints": 300,
    "timeLimit": 300
  }
];

```

---

## official-data.js

```javascript
export const OFFICIAL_STAGES = [
  {
    "officialStage": 1,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 1,
    "title": "โครงสร้าง HTML5",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 2,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 3,
    "title": "ลิงก์และ Navigation",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 3,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 5,
    "title": "รายการข้อมูล",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 4,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 10,
    "title": "ตารางพื้นฐาน",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 5,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 13,
    "title": "Input และ Label",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 6,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 16,
    "title": "Select และ Option",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 7,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 20,
    "title": "Form สมัครสมาชิก",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 8,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 21,
    "title": "Header",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 9,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 22,
    "title": "Nav",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 10,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 23,
    "title": "Main",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 11,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 24,
    "title": "Section",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 12,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 25,
    "title": "Article",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 13,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 27,
    "title": "Footer",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 14,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 28,
    "title": "Figure",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 15,
    "language": "html",
    "languageName": "HTML",
    "sourceStage": 30,
    "title": "Progress",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 16,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 1,
    "title": "print พื้นฐาน",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 17,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 4,
    "title": "การคำนวณ",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 18,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 9,
    "title": "if พื้นฐาน",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 19,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 10,
    "title": "if else",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 20,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 14,
    "title": "List",
    "maxScore": 1,
    "requiredForSubmission": true
  },
  {
    "officialStage": 21,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 17,
    "title": "For Loop",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 22,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 19,
    "title": "While Loop",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 23,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 22,
    "title": "Function",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 24,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 23,
    "title": "Function Parameter",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 25,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 24,
    "title": "Return",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 26,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 28,
    "title": "Dictionary",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 27,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 30,
    "title": "List Comprehension",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 28,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 36,
    "title": "Try / Except",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 29,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 39,
    "title": "Constructor",
    "maxScore": 2,
    "requiredForSubmission": true
  },
  {
    "officialStage": 30,
    "language": "python",
    "languageName": "Python",
    "sourceStage": 50,
    "title": "Mini Game Logic",
    "maxScore": 2,
    "requiredForSubmission": true
  }
];
export const OFFICIAL_TOTAL_SCORE = 40;

```

---

## ranking-system.js

```javascript
export const RANKING_CONFIG = {
  seasonDays: 60,

  weights: {
    diligence: 0.35,
    accuracy: 0.30,
    speed: 0.20,
    consistency: 0.15
  },

  // WPM เทียบกับช่วงคะแนนความเร็ว 0-100
  speedReferenceWpm: 80,

  tiers: [
    {id:"bronze", name:"Bronze", icon:"🥉", min:0},
    {id:"silver", name:"Silver", icon:"🥈", min:35},
    {id:"gold", name:"Gold", icon:"🥇", min:55},
    {id:"platinum", name:"Platinum", icon:"💠", min:70},
    {id:"diamond", name:"Diamond", icon:"💎", min:82},
    {id:"master", name:"Master", icon:"👑", min:92}
  ]
};

export function seasonIdFromDate(date = new Date()) {
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((date.getTime() - epoch) / 86400000);
  const season = Math.floor(Math.max(0, days) / RANKING_CONFIG.seasonDays) + 1;
  return `S${String(season).padStart(3, "0")}`;
}

export function seasonRange(date = new Date()) {
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((date.getTime() - epoch) / 86400000);
  const seasonIndex = Math.floor(Math.max(0, days) / RANKING_CONFIG.seasonDays);
  const start = new Date(epoch + seasonIndex * RANKING_CONFIG.seasonDays * 86400000);
  const end = new Date(start.getTime() + RANKING_CONFIG.seasonDays * 86400000 - 1);
  return { start, end };
}

export function calculateRankMetrics(attempts, activeDayCount = 0) {
  const completed = attempts.filter(a => a.status === "completed");
  const total = completed.length;

  const avgAccuracy = total
    ? completed.reduce((s,a)=>s + Number(a.accuracy || 0), 0) / total
    : 0;

  const avgWpm = total
    ? completed.reduce((s,a)=>s + Number(a.wpm || 0), 0) / total
    : 0;

  // ความขยัน: จำนวนด่าน + จำนวนวันที่กลับมาใช้งาน
  const attemptFactor = Math.min(100, total * 2.5);
  const dayFactor = Math.min(100, activeDayCount * 4);
  const diligence = attemptFactor * 0.65 + dayFactor * 0.35;

  // ความเร็ว: ไม่ให้ความเร็วสูงอย่างเดียวชนะ Accuracy
  const speed = Math.min(100, (avgWpm / RANKING_CONFIG.speedReferenceWpm) * 100);

  // ความสม่ำเสมอ: Accuracy กระจายน้อย + มีหลายรอบ
  let consistency = 0;
  if (total) {
    const mean = avgAccuracy;
    const variance = completed.reduce((s,a)=>{
      const d = Number(a.accuracy || 0) - mean;
      return s + d*d;
    },0) / total;
    const std = Math.sqrt(variance);
    const stability = Math.max(0, 100 - std * 2);
    const volume = Math.min(100, total * 4);
    consistency = stability * 0.7 + volume * 0.3;
  }

  const accuracy = Math.max(0, Math.min(100, avgAccuracy));

  const rating = Math.round(
    diligence * RANKING_CONFIG.weights.diligence +
    accuracy * RANKING_CONFIG.weights.accuracy +
    speed * RANKING_CONFIG.weights.speed +
    consistency * RANKING_CONFIG.weights.consistency
  );

  const tiers = [...RANKING_CONFIG.tiers].sort((a,b)=>b.min-a.min);
  const tier = tiers.find(t => rating >= t.min) || RANKING_CONFIG.tiers[0];

  return {
    rating,
    tierId: tier.id,
    tierName: tier.name,
    tierIcon: tier.icon,
    diligence: Math.round(diligence),
    accuracy: Math.round(accuracy),
    speed: Math.round(speed),
    consistency: Math.round(consistency),
    avgWpm: Math.round(avgWpm * 10) / 10,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    completedAttempts: total,
    activeDayCount
  };
}

```

---

## reward-data.js

```javascript
export const REWARD_ITEMS = [
  {id:"cap_blue",name:"หมวก Coder ฟ้า",icon:"🧢",cost:250,type:"wearable",slot:"head",rarity:"common",visual:"cap",description:"หมวกเรียบง่ายสำหรับผู้เริ่มต้น"},
  {id:"shirt_blue",name:"เสื้อ Code ฟ้า",icon:"👕",cost:350,type:"wearable",slot:"top",rarity:"common",visual:"shirt_blue",description:"เสื้อสีฟ้าสไตล์ Coder"},
  {id:"sneaker_white",name:"รองเท้าขาว",icon:"👟",cost:450,type:"wearable",slot:"shoes",rarity:"common",visual:"shoe_white",description:"รองเท้าพื้นฐานดูสะอาด"},

  {id:"thai_sash",name:"ผ้าคาดไทย",icon:"🎗️",cost:700,type:"wearable",slot:"top",rarity:"rare",visual:"thai_sash",description:"ผ้าคาดลายไทยเพิ่มความโดดเด่น"},
  {id:"student_bag",name:"กระเป๋านักเรียน",icon:"🎒",cost:850,type:"wearable",slot:"back",rarity:"rare",visual:"backpack",description:"กระเป๋าสะพายสำหรับตัวละคร"},
  {id:"round_glasses",name:"แว่นทรงกลม",icon:"👓",cost:1000,type:"wearable",slot:"face",rarity:"rare",visual:"glasses",description:"แว่นสำหรับสายวิชาการ"},

  {id:"coder_jacket",name:"แจ็กเก็ต Cyber Coder",icon:"🧥",cost:1600,type:"wearable",slot:"top",rarity:"epic",visual:"cyber_jacket",description:"แจ็กเก็ตไซเบอร์มีขอบเรืองแสง"},
  {id:"neon_headset",name:"หูฟัง Neon",icon:"🎧",cost:1900,type:"wearable",slot:"head",rarity:"epic",visual:"neon_headset",description:"หูฟัง Neon สำหรับสายเกม"},
  {id:"code_tablet",name:"แท็บเล็ต Code",icon:"📱",cost:2200,type:"wearable",slot:"hand",rarity:"epic",visual:"tablet",description:"แท็บเล็ตเรืองแสงถือในมือ"},

  {id:"gold_crown",name:"มงกุฎทอง Coder",icon:"👑",cost:3500,type:"wearable",slot:"head",rarity:"legendary",visual:"gold_crown",description:"มงกุฎทองสำหรับผู้เล่นระดับสูง"},
  {id:"royal_cape",name:"ผ้าคลุม Royal Code",icon:"🦸",cost:4200,type:"wearable",slot:"back",rarity:"legendary",visual:"royal_cape",description:"ผ้าคลุมใหญ่พร้อมขอบทอง"},
  {id:"gold_aura",name:"ออร่าสีทอง",icon:"✨",cost:5000,type:"wearable",slot:"aura",rarity:"legendary",visual:"gold_aura",description:"ออร่าทองล้อมรอบตัวละคร"},

  {id:"dragon_wings",name:"ปีกมังกร Cyber",icon:"🐉",cost:7500,type:"wearable",slot:"back",rarity:"mythic",visual:"dragon_wings",description:"ปีกมังกรเรืองแสงขนาดใหญ่"},
  {id:"master_halo",name:"วงแหวน Master",icon:"🌟",cost:9000,type:"wearable",slot:"aura",rarity:"mythic",visual:"master_halo",description:"วงแหวนพลังระดับ Master"},
  {id:"phoenix_pet",name:"สัตว์เลี้ยง Phoenix",icon:"🔥",cost:12000,type:"wearable",slot:"pet",rarity:"mythic",visual:"phoenix_pet",description:"Phoenix ไฟลอยข้างตัวละคร"},
  {id:"throne_effect",name:"บัลลังก์ Code Emperor",icon:"🏆",cost:18000,type:"wearable",slot:"aura",rarity:"mythic",visual:"throne",description:"เอฟเฟกต์สูงสุดของร้าน Token"}
];

export const RARITY_META = {
  common:{name:"COMMON",order:1},
  rare:{name:"RARE",order:2},
  epic:{name:"EPIC",order:3},
  legendary:{name:"LEGENDARY",order:4},
  mythic:{name:"MYTHIC",order:5}
};

```

---

## character-system.js

```javascript
export const DEFAULT_CHARACTER = {
  avatarId: "base_student",
  gender: null,
  displayName: "",
  equipped: {
    head: null,
    face: null,
    top: null,
    bottom: null,
    shoes: null,
    back: null,
    hand: null,
    aura: null,
    pet: null
  }
};

export const DEFAULT_ZONE_STATE = {
  zoneId: "thai_social_zone_v4_1",
  x: 520,
  y: 700,
  direction: "right",
  lastSeenAt: null
};

```

---

## default-data.js

```javascript
export const DEFAULT_MODES = [
  {
    id: "classic",
    name: "Classic",
    icon: "⌨️",
    description: "โหมดมาตรฐาน พิมพ์ Code ตามต้นฉบับ จับเวลา WPM และ Accuracy",
    scoreMultiplier: 1.00,
    timeMultiplier: 1.00,
    mistakePenalty: 2,
    enforceTimeLimit: false,
    allowBackspace: true,
    sortOrder: 1
  },
  {
    id: "speed",
    name: "Speed Rush",
    icon: "⚡",
    description: "เวลาน้อยลง ต้องพิมพ์ให้ทัน ได้ตัวคูณคะแนนสูงขึ้น",
    scoreMultiplier: 1.35,
    timeMultiplier: 0.65,
    mistakePenalty: 2.5,
    enforceTimeLimit: true,
    allowBackspace: true,
    sortOrder: 2
  },
  {
    id: "accuracy",
    name: "Accuracy Pro",
    icon: "🎯",
    description: "เน้นความแม่นยำ พิมพ์ผิดหักคะแนนมากกว่า Classic",
    scoreMultiplier: 1.20,
    timeMultiplier: 1.20,
    mistakePenalty: 6,
    enforceTimeLimit: false,
    allowBackspace: true,
    sortOrder: 3
  },
  {
    id: "hardcore",
    name: "Hardcore",
    icon: "🔥",
    description: "จำกัดเวลาและห้าม Backspace/Delete คะแนนสูงที่สุด",
    scoreMultiplier: 1.70,
    timeMultiplier: 0.80,
    mistakePenalty: 7,
    enforceTimeLimit: true,
    allowBackspace: false,
    sortOrder: 4
  }
];

export const DEFAULT_LEVELS = [
  {
    levelNo: 1, title: "HTML: Hello World", language: "HTML",
    difficulty: "ง่าย", difficultyMultiplier: 1.00, basePoints: 100,
    timeLimit: 90, description: "โครงสร้าง HTML เบื้องต้น",
    code: `<!DOCTYPE html>
<html>
<body>
    <h1>Hello World</h1>
</body>
</html>`
  },
  {
    levelNo: 2, title: "CSS: Button Style", language: "CSS",
    difficulty: "ง่าย", difficultyMultiplier: 1.10, basePoints: 140,
    timeLimit: 95, description: "Selector และ Property พื้นฐาน",
    code: `.button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}`
  },
  {
    levelNo: 3, title: "JavaScript: Condition", language: "JavaScript",
    difficulty: "ง่าย", difficultyMultiplier: 1.20, basePoints: 200,
    timeLimit: 105, description: "ตัวแปรและ if / else",
    code: `const score = 80;

if (score >= 50) {
    console.log("Pass");
} else {
    console.log("Try again");
}`
  },
  {
    levelNo: 4, title: "Python: For Loop", language: "Python",
    difficulty: "ง่าย", difficultyMultiplier: 1.30, basePoints: 260,
    timeLimit: 115, description: "List, for loop และ f-string",
    code: `subjects = ["HTML", "CSS", "JavaScript", "Python"]

for subject in subjects:
    print(f"Learning: {subject}")`
  },
  {
    levelNo: 5, title: "HTML: Login Form", language: "HTML",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.45, basePoints: 350,
    timeLimit: 130, description: "Form, Label, Input และ Button",
    code: `<form id="loginForm">
    <label for="email">Email</label>
    <input id="email" type="email" required>

    <label for="password">Password</label>
    <input id="password" type="password" required>

    <button type="submit">Login</button>
</form>`
  },
  {
    levelNo: 6, title: "CSS: Responsive Grid", language: "CSS",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.60, basePoints: 450,
    timeLimit: 145, description: "CSS Grid และ Media Query",
    code: `.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}`
  },
  {
    levelNo: 7, title: "JavaScript: Array Methods", language: "JavaScript",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.75, basePoints: 560,
    timeLimit: 160, description: "filter, map และ Arrow Function",
    code: `function calculateBonus(scores) {
    return scores
        .filter(score => score >= 50)
        .map(score => score + 10);
}

console.log(calculateBonus([40, 55, 70]));`
  },
  {
    levelNo: 8, title: "Python: Dictionary", language: "Python",
    difficulty: "ปานกลาง", difficultyMultiplier: 1.90, basePoints: 680,
    timeLimit: 175, description: "Dictionary Comprehension",
    code: `scores = {"Ann": 72, "Boy": 48, "Cat": 91}

passed = {
    name: score
    for name, score in scores.items()
    if score >= 50
}

print(passed)`
  },
  {
    levelNo: 9, title: "JavaScript: DOM Event", language: "JavaScript",
    difficulty: "ยาก", difficultyMultiplier: 2.10, basePoints: 820,
    timeLimit: 190, description: "DOM และ Event Listener",
    code: `const button = document.querySelector("#startButton");
const statusText = document.querySelector("#status");

button.addEventListener("click", () => {
    statusText.textContent = "Game started!";
    button.disabled = true;
});`
  },
  {
    levelNo: 10, title: "Python: Class", language: "Python",
    difficulty: "ยาก", difficultyMultiplier: 2.30, basePoints: 980,
    timeLimit: 210, description: "Class, Constructor และ Method",
    code: `class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name
        self.score = 0

    def add_score(self, points):
        self.score += points
        return self.score`
  },
  {
    levelNo: 11, title: "JavaScript: Async Await", language: "JavaScript",
    difficulty: "ยาก", difficultyMultiplier: 2.60, basePoints: 1200,
    timeLimit: 230, description: "async / await, fetch และ error handling",
    code: `async function loadStudents() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const students = await response.json();
        return students;
    } catch (error) {
        console.error(error);
        return [];
    }
}`
  },
  {
    levelNo: 12, title: "Flask: JSON API Endpoint", language: "Python / Flask",
    difficulty: "Expert", difficultyMultiplier: 3.00, basePoints: 1500,
    timeLimit: 260, description: "Flask Route, JSON และ Validation",
    code: `@app.post("/api/score")
def save_score():
    data = request.get_json()

    if not data or "score" not in data:
        return jsonify({"error": "score is required"}), 400

    score = int(data["score"])

    return jsonify({
        "success": True,
        "score": score
    }), 201`
  }
];

```

---

## firestore.rules

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function isAdmin() { return signedIn() && request.auth.uid == "TWUrLjOh3BTa1cBNwDXKk4X2IAg1"; }
    function hasZoneModeration() { return signedIn() && exists(/databases/$(database)/documents/zone_moderation/$(request.auth.uid)); }
    function activeZoneBan() {
      return hasZoneModeration()
        && ('bannedUntil' in get(/databases/$(database)/documents/zone_moderation/$(request.auth.uid)).data)
        && get(/databases/$(database)/documents/zone_moderation/$(request.auth.uid)).data.bannedUntil > request.time;
    }
    function activeZoneKick() {
      return hasZoneModeration()
        && ('kickedUntil' in get(/databases/$(database)/documents/zone_moderation/$(request.auth.uid)).data)
        && get(/databases/$(database)/documents/zone_moderation/$(request.auth.uid)).data.kickedUntil > request.time;
    }
    function zoneAccessAllowed() { return signedIn() && !activeZoneBan() && !activeZoneKick(); }

    match /game_modes/{modeId} { allow read: if signedIn(); allow write: if isAdmin(); }
    match /levels/{levelId} { allow read: if signedIn(); allow write: if isAdmin(); }

    match /users/{uid} {
      allow create: if signedIn() && request.auth.uid == uid;
      allow read, update: if signedIn() && request.auth.uid == uid;
      allow read, write: if isAdmin();
    }

    match /pvp_rooms/{roomCode} {
      allow read: if signedIn();

      allow create: if signedIn()
        && request.resource.data.hostUid == request.auth.uid
        && request.resource.data.code == roomCode
        && request.resource.data.status == "waiting"
        && request.resource.data.players is map
        && request.auth.uid in request.resource.data.players
        && request.resource.data.players.size() == 1;

      allow update: if signedIn()
        && request.resource.data.hostUid == resource.data.hostUid
        && request.resource.data.code == resource.data.code
        && request.resource.data.players is map
        && request.resource.data.players.size() <= 2
        && (
          request.auth.uid in resource.data.players
          || (
            resource.data.status == "waiting"
            && request.auth.uid in request.resource.data.players
            && request.resource.data.players.size() == resource.data.players.size() + 1
          )
        );

      allow delete: if isAdmin()
        || (signedIn() && resource.data.hostUid == request.auth.uid);
    }

    match /official_submissions/{uid} {
      allow create, update: if signedIn() && request.auth.uid == uid;
      allow read: if signedIn() && request.auth.uid == uid;
      allow read, write: if isAdmin();
    }
    match /rankings/{rankingId} { allow read: if signedIn(); allow write: if isAdmin(); }
    match /attempts/{attemptId} {
      allow create: if signedIn() && request.resource.data.uid == request.auth.uid;
      allow read, update: if signedIn() && resource.data.uid == request.auth.uid;
      allow read, write: if isAdmin();
    }

    match /public_profiles/{uid} {
      allow read: if signedIn();
      allow create, update, delete: if signedIn() && request.auth.uid == uid;
      allow read, write: if isAdmin();
    }
    match /presence/{uid} {
      allow read: if signedIn();
      allow create, update, delete: if signedIn() && request.auth.uid == uid;
      allow read, write: if isAdmin();
    }

    match /zone_positions/{uid} {
      allow read: if isAdmin() || zoneAccessAllowed();
      allow create, update: if request.auth.uid == uid
        && request.resource.data.uid == request.auth.uid
        && (
          isAdmin()
          || (
            zoneAccessAllowed()
            && request.resource.data.studentId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.studentId
          )
        );
      allow delete: if isAdmin() || (zoneAccessAllowed() && request.auth.uid == uid);
    }

    match /zone_messages/{messageId} {
      allow read: if isAdmin() || zoneAccessAllowed();

      // GM: ข้อความถาวร ไม่มี expiresAt และปลอม GM ไม่ได้เพราะตรวจ ADMIN_UID
      allow create: if isAdmin()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.studentId == "GM"
        && request.resource.data.isGM == true
        && request.resource.data.createdAt == request.time
        && request.resource.data.zoneId is string
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 120
        && !('expiresAt' in request.resource.data);

      // USER: ข้อความมีอายุไม่เกิน 24 ชั่วโมง
      allow create: if !isAdmin()
        && zoneAccessAllowed()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.studentId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.studentId
        && request.resource.data.isGM == false
        && request.resource.data.createdAt == request.time
        && request.resource.data.zoneId is string
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 120
        && request.resource.data.expiresAt is timestamp
        && request.resource.data.expiresAt > request.time
        && request.resource.data.expiresAt <= request.time + duration.value(30, 'h');

      allow update: if false;
      allow delete: if isAdmin() || (zoneAccessAllowed() && resource.data.uid == request.auth.uid);
    }


    match /zone_chat_archive/{messageId} {
      allow read: if isAdmin();
      allow create: if signedIn()
        && existsAfter(/databases/$(database)/documents/zone_messages/$(messageId))
        && request.resource.data.messageId == messageId
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.uid == getAfter(/databases/$(database)/documents/zone_messages/$(messageId)).data.uid
        && request.resource.data.studentId == getAfter(/databases/$(database)/documents/zone_messages/$(messageId)).data.studentId
        && request.resource.data.text == getAfter(/databases/$(database)/documents/zone_messages/$(messageId)).data.text
        && request.resource.data.zoneId == getAfter(/databases/$(database)/documents/zone_messages/$(messageId)).data.zoneId
        && request.resource.data.isGM == getAfter(/databases/$(database)/documents/zone_messages/$(messageId)).data.isGM
        && request.resource.data.createdAt == request.time
        && request.resource.data.archivedAt == request.time;
      allow update: if false;
      allow delete: if isAdmin();
    }

    match /zone_moderation/{uid} {
      allow read: if isAdmin() || (signedIn() && request.auth.uid == uid);
      allow create, update, delete: if isAdmin();
    }
  }
}

```
