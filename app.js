(function () {
  const chassisOptions = [
    {
      id: "street-viper",
      name: "Street Viper",
      tag: "Balanced",
      description: "An agile all-rounder with enough plating to survive a close duel.",
      stats: { speed: 66, armor: 58, damage: 50, repair: 42, hull: 120, handling: 72 },
      color: "#6be6ff",
      special: "Adaptive steering for quick lane changes.",
      strategy: "Great first pick for mixed range fights."
    },
    {
      id: "ironclad-brute",
      name: "Ironclad Brute",
      tag: "Heavy",
      description: "Slow to rotate but tough enough to bully the center of the arena.",
      stats: { speed: 42, armor: 84, damage: 56, repair: 45, hull: 155, handling: 44 },
      color: "#8dd4a8",
      special: "Reinforced bumper shrugs off chip damage.",
      strategy: "Push forward, trade hits, and let the armor win attrition."
    },
    {
      id: "dust-comet",
      name: "Dust Comet",
      tag: "Scout",
      description: "A lightweight racer that thrives on hit-and-run passes and fast repositions.",
      stats: { speed: 86, armor: 34, damage: 45, repair: 38, hull: 94, handling: 86 },
      color: "#f6c762",
      special: "High-grip tires preserve speed through turns.",
      strategy: "Circle wide, boost through gaps, and avoid long trades."
    }
  ];

  const weaponOptions = [
    {
      id: "pulse-chaingun",
      name: "Pulse Chaingun",
      tag: "Mid range",
      description: "Fast-firing ballistic kit that keeps pressure on moving targets.",
      stats: { damage: 14, cooldown: 0.22, projectileSpeed: 540, range: 320, spread: 0.12 },
      bonus: { damage: 6, speed: 0, armor: 0, repair: 0 },
      strategy: "Reliable in every duel and forgiving if your aim drifts."
    },
    {
      id: "scrap-lancer",
      name: "Scrap Lancer",
      tag: "Burst",
      description: "A hard-hitting rocket rack with slower reload but nasty direct damage.",
      stats: { damage: 26, cooldown: 0.62, projectileSpeed: 430, range: 360, spread: 0.07 },
      bonus: { damage: 16, speed: -4, armor: 0, repair: 0 },
      strategy: "Land clean shots during enemy approach windows."
    },
    {
      id: "ember-sprayer",
      name: "Ember Sprayer",
      tag: "Close range",
      description: "Short-range flame projector with generous hit width and armor melt.",
      stats: { damage: 11, cooldown: 0.12, projectileSpeed: 320, range: 210, spread: 0.25 },
      bonus: { damage: 10, speed: 2, armor: 0, repair: 0 },
      strategy: "Rush the target, burn through armor, then retreat to cool off."
    }
  ];

  const tuningOptions = [
    {
      id: "pit-crew",
      name: "Pit Crew Nano Kit",
      tag: "Support",
      description: "Upgraded auto-welders increase repair output and recharge between uses.",
      bonus: { speed: -3, armor: 4, damage: 0, repair: 24, handling: 0, hull: 8, boost: 0.95 },
      repairCharges: 3,
      repairAmount: 34,
      special: "Restores more hull per repair burst."
    },
    {
      id: "overdrive",
      name: "Overdrive Circuit",
      tag: "Speed",
      description: "Lighter components improve acceleration and boost recovery at the cost of plating.",
      bonus: { speed: 12, armor: -8, damage: 0, repair: 0, handling: 8, hull: -6, boost: 1.18 },
      repairCharges: 2,
      repairAmount: 22,
      special: "Boost returns faster and covers more distance."
    },
    {
      id: "siege-rig",
      name: "Siege Rig Plating",
      tag: "Armor",
      description: "Extra plating and stabilizers keep the chassis steady under heavy fire.",
      bonus: { speed: -7, armor: 12, damage: 4, repair: 6, handling: -6, hull: 18, boost: 0.88 },
      repairCharges: 2,
      repairAmount: 26,
      special: "Adds staying power for face-to-face brawls."
    }
  ];

  const statDefinitions = [
    { key: "speed", label: "Speed" },
    { key: "armor", label: "Armor" },
    { key: "damage", label: "Damage" },
    { key: "repair", label: "Repair" },
    { key: "handling", label: "Handling" }
  ];

  const state = {
    selection: {
      chassis: chassisOptions[0].id,
      weapon: weaponOptions[0].id,
      tuning: tuningOptions[0].id
    },
    input: {
      up: false,
      down: false,
      left: false,
      right: false
    },
    audioEnabled: false,
    loadout: null,
    battle: null,
    animationFrame: 0,
    lastTime: 0
  };

  const elements = {
    garageScreen: document.getElementById("garageScreen"),
    arenaScreen: document.getElementById("arenaScreen"),
    chassisOptions: document.getElementById("chassisOptions"),
    weaponOptions: document.getElementById("weaponOptions"),
    tuningOptions: document.getElementById("tuningOptions"),
    statBars: document.getElementById("statBars"),
    summaryChassis: document.getElementById("summaryChassis"),
    summaryWeapon: document.getElementById("summaryWeapon"),
    summaryTuning: document.getElementById("summaryTuning"),
    previewVehicle: document.getElementById("previewVehicle"),
    specialLabel: document.getElementById("specialLabel"),
    strategyLabel: document.getElementById("strategyLabel"),
    startBattle: document.getElementById("startBattle"),
    restartBattle: document.getElementById("restartBattle"),
    backToGarage: document.getElementById("backToGarage"),
    arenaBrief: document.getElementById("arenaBrief"),
    battleOverlay: document.getElementById("battleOverlay"),
    overlayEyebrow: document.getElementById("overlayEyebrow"),
    overlayTitle: document.getElementById("overlayTitle"),
    overlayText: document.getElementById("overlayText"),
    overlayReplay: document.getElementById("overlayReplay"),
    overlayGarage: document.getElementById("overlayGarage"),
    battleLog: document.getElementById("battleLog"),
    playerStatusTag: document.getElementById("playerStatusTag"),
    enemyStatusTag: document.getElementById("enemyStatusTag"),
    enemyBehavior: document.getElementById("enemyBehavior"),
    playerArmorText: document.getElementById("playerArmorText"),
    playerHullText: document.getElementById("playerHullText"),
    playerHullBar: document.getElementById("playerHullBar"),
    enemyNameText: document.getElementById("enemyNameText"),
    enemyHullText: document.getElementById("enemyHullText"),
    enemyHullBar: document.getElementById("enemyHullBar"),
    boostText: document.getElementById("boostText"),
    boostBar: document.getElementById("boostBar"),
    repairText: document.getElementById("repairText"),
    repairBar: document.getElementById("repairBar"),
    phaseTag: document.getElementById("phaseTag"),
    toggleAudio: document.getElementById("toggleAudio"),
    fireButton: document.getElementById("fireButton"),
    boostButton: document.getElementById("boostButton"),
    repairButton: document.getElementById("repairButton"),
    canvas: document.getElementById("battlefield")
  };
  const ctx = elements.canvas.getContext("2d");

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getById(list, id) {
    return list.find((item) => item.id === id);
  }

  function computeLoadout(selection) {
    const chassis = getById(chassisOptions, selection.chassis);
    const weapon = getById(weaponOptions, selection.weapon);
    const tuning = getById(tuningOptions, selection.tuning);
    const combined = {
      speed: clamp(chassis.stats.speed + weapon.bonus.speed + tuning.bonus.speed, 20, 100),
      armor: clamp(chassis.stats.armor + weapon.bonus.armor + tuning.bonus.armor, 10, 100),
      damage: clamp(chassis.stats.damage + weapon.bonus.damage + tuning.bonus.damage, 15, 100),
      repair: clamp(chassis.stats.repair + weapon.bonus.repair + tuning.bonus.repair, 10, 100),
      handling: clamp(chassis.stats.handling + tuning.bonus.handling, 20, 100),
      hull: clamp(chassis.stats.hull + tuning.bonus.hull, 80, 190)
    };

    return {
      chassis,
      weapon,
      tuning,
      stats: combined,
      repairCharges: tuning.repairCharges,
      repairAmount: clamp(tuning.repairAmount + Math.round(combined.repair * 0.08), 18, 50),
      boostScale: tuning.bonus.boost,
      summary:
        chassis.strategy + " Pair it with " + weapon.name + " and " + tuning.name + " for a compact tablet-ready build."
    };
  }

  function renderOptionGroup(container, options, selectionKey) {
    container.innerHTML = "";
    const selectedId = state.selection[selectionKey];

    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card" + (selectedId === option.id ? " is-selected" : "");
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(selectedId === option.id));
      button.dataset.optionId = option.id;
      button.dataset.selectionKey = selectionKey;

      const statItems =
        selectionKey === "weapon"
          ? [
              `Damage +${option.bonus.damage}`,
              `${Math.round(option.stats.range)} range`,
              `${Math.round(option.stats.cooldown * 1000)}ms reload`
            ]
          : selectionKey === "tuning"
            ? [
                `${option.bonus.speed >= 0 ? "+" : ""}${option.bonus.speed} speed`,
                `${option.bonus.armor >= 0 ? "+" : ""}${option.bonus.armor} armor`,
                `${option.repairCharges} repair uses`
              ]
            : [
                `${option.stats.hull} hull`,
                `${option.stats.armor} armor`,
                `${option.stats.speed} speed`
              ];

      button.innerHTML = `
        <div class="option-card-header">
          <span class="option-card-title">${option.name}</span>
          <span class="option-card-tag">${option.tag}</span>
        </div>
        <p>${option.description}</p>
        <div class="option-stats">
          ${statItems.map((item) => `<span>${item}</span>`).join("")}
        </div>
      `;

      button.addEventListener("click", () => {
        state.selection[selectionKey] = option.id;
        refreshGarage();
      });

      container.appendChild(button);
    });
  }

  function renderStatBars(loadout) {
    elements.statBars.innerHTML = "";

    statDefinitions.forEach((definition) => {
      const row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = `
        <header>
          <strong>${definition.label}</strong>
          <span>${loadout.stats[definition.key]}</span>
        </header>
        <div class="stat-track">
          <div class="stat-fill" style="width: ${loadout.stats[definition.key]}%"></div>
        </div>
      `;
      elements.statBars.appendChild(row);
    });
  }

  function refreshGarage() {
    state.loadout = computeLoadout(state.selection);
    const { chassis, weapon, tuning, stats } = state.loadout;

    renderOptionGroup(elements.chassisOptions, chassisOptions, "chassis");
    renderOptionGroup(elements.weaponOptions, weaponOptions, "weapon");
    renderOptionGroup(elements.tuningOptions, tuningOptions, "tuning");
    renderStatBars(state.loadout);

    elements.summaryChassis.textContent = chassis.name;
    elements.summaryWeapon.textContent = weapon.name;
    elements.summaryTuning.textContent = tuning.name;
    elements.previewVehicle.style.setProperty("--preview-color", chassis.color);
    elements.specialLabel.textContent = tuning.special;
    elements.strategyLabel.textContent = weapon.strategy;
    elements.arenaBrief.textContent = state.loadout.summary;
    elements.startBattle.textContent = `Enter the arena with ${chassis.name}`;

    const previewTurret = elements.previewVehicle.querySelector(".preview-turret");
    previewTurret.style.width = `${clamp(1.8 + weapon.bonus.damage * 0.035, 2.1, 3.5)}rem`;
    previewTurret.style.background =
      weapon.id === "scrap-lancer"
        ? "linear-gradient(90deg, #ffd27a, #ff5968)"
        : weapon.id === "ember-sprayer"
          ? "linear-gradient(90deg, #ffc14d, #ff7d52)"
          : "linear-gradient(90deg, #9bdcff, #7a86ff)";

    const pressureScore = Math.round((stats.damage + stats.speed + stats.handling) / 3);
    const sustainScore = Math.round((stats.armor + stats.repair + clamp(stats.hull / 2, 0, 100)) / 3);
    elements.strategyLabel.textContent = `${weapon.strategy} Pressure ${pressureScore} / Sustain ${sustainScore}`;
  }

  function addLog(message, tone) {
    const entry = document.createElement("li");
    entry.textContent = message;
    if (tone === "good") {
      entry.style.color = "#d7ffe0";
    } else if (tone === "bad") {
      entry.style.color = "#ffd3d7";
    } else if (tone === "accent") {
      entry.style.color = "#d9f7ff";
    }
    elements.battleLog.prepend(entry);
    while (elements.battleLog.children.length > 6) {
      elements.battleLog.removeChild(elements.battleLog.lastChild);
    }
  }

  function setScreen(screen) {
    elements.garageScreen.classList.toggle("active", screen === "garage");
    elements.arenaScreen.classList.toggle("active", screen === "arena");
  }

  function createBattle() {
    const loadout = state.loadout || computeLoadout(state.selection);
    const playerMaxHull = loadout.stats.hull;
    const speedScale = loadout.stats.speed / 100;
    const handlingScale = loadout.stats.handling / 100;
    const boostMultiplier = loadout.boostScale;

    state.battle = {
      over: false,
      winner: null,
      player: {
        name: loadout.chassis.name,
        x: 170,
        y: 270,
        angle: 0,
        hull: playerMaxHull,
        maxHull: playerMaxHull,
        armor: loadout.stats.armor,
        speed: 130 + speedScale * 130,
        handling: 1.9 + handlingScale * 1.8,
        damage: loadout.weapon.stats.damage + loadout.stats.damage * 0.18,
        weapon: loadout.weapon,
        repairPower: loadout.repairAmount,
        repairCharges: loadout.repairCharges,
        boost: 100,
        boostMultiplier,
        fireCooldown: 0,
        flash: 0,
        reloadPenalty: 1 - clamp((loadout.stats.repair - 40) / 250, 0, 0.2)
      },
      enemy: {
        name: "Road Reaper",
        x: 770,
        y: 270,
        angle: Math.PI,
        hull: 138,
        maxHull: 138,
        armor: 46,
        speed: 178,
        handling: 2.4,
        damage: 19,
        fireCooldown: 0,
        behavior: "Circling for an opening"
      },
      projectiles: [],
      arena: { width: elements.canvas.width, height: elements.canvas.height },
      introTimer: 0.7
    };

    elements.enemyNameText.textContent = state.battle.enemy.name;
    elements.battleOverlay.classList.add("hidden");
    elements.phaseTag.textContent = "Live";
    elements.playerStatusTag.textContent = "Ready";
    elements.enemyStatusTag.textContent = "Aggressive";
    elements.enemyBehavior.textContent = state.battle.enemy.behavior;
    elements.battleLog.innerHTML = "";
    addLog(`Rolling out with ${loadout.chassis.name}, ${loadout.weapon.name}, and ${loadout.tuning.name}.`, "accent");
    addLog("Destroy the enemy before your hull is stripped away.", "accent");
    updateHud();
  }

  function startBattle() {
    refreshGarage();
    createBattle();
    setScreen("arena");
    if (!state.animationFrame) {
      state.lastTime = performance.now();
      state.animationFrame = requestAnimationFrame(tick);
    }
  }

  function restartBattle() {
    createBattle();
    setScreen("arena");
  }

  function showOverlay(result) {
    const messages = {
      victory: {
        eyebrow: "Arena cleared",
        title: "Victory",
        text: "The Road Reaper is down. Your custom build survived the test run."
      },
      defeat: {
        eyebrow: "Vehicle disabled",
        title: "Defeat",
        text: "Your hull gave out. Swap kits or timing, then jump back into the arena."
      }
    };

    elements.overlayEyebrow.textContent = messages[result].eyebrow;
    elements.overlayTitle.textContent = messages[result].title;
    elements.overlayText.textContent = messages[result].text;
    elements.battleOverlay.classList.remove("hidden");
    elements.phaseTag.textContent = result === "victory" ? "Won" : "Lost";
  }

  function updateHud() {
    const battle = state.battle;
    if (!battle) {
      return;
    }

    const playerHullPct = clamp((battle.player.hull / battle.player.maxHull) * 100, 0, 100);
    const enemyHullPct = clamp((battle.enemy.hull / battle.enemy.maxHull) * 100, 0, 100);

    elements.playerArmorText.textContent = `${Math.round(battle.player.armor)} plating`;
    elements.playerHullText.textContent = `${Math.max(0, Math.ceil(battle.player.hull))} / ${battle.player.maxHull}`;
    elements.playerHullBar.style.width = `${playerHullPct}%`;
    elements.enemyHullText.textContent = `${Math.max(0, Math.ceil(battle.enemy.hull))} / ${battle.enemy.maxHull}`;
    elements.enemyHullBar.style.width = `${enemyHullPct}%`;

    const boostPct = clamp(battle.player.boost, 0, 100);
    const maxRepairs = state.loadout.repairCharges;
    const repairPct = maxRepairs ? (battle.player.repairCharges / maxRepairs) * 100 : 0;

    elements.boostText.textContent = `${Math.round(boostPct)}%`;
    elements.boostBar.style.width = `${boostPct}%`;
    elements.repairText.textContent = `${battle.player.repairCharges} burst${battle.player.repairCharges === 1 ? "" : "s"}`;
    elements.repairBar.style.width = `${repairPct}%`;

    if (battle.over) {
      elements.playerStatusTag.textContent = battle.winner === "player" ? "Standing" : "Wrecked";
      elements.enemyStatusTag.textContent = battle.winner === "player" ? "Destroyed" : "Threat";
    } else if (playerHullPct < 35) {
      elements.playerStatusTag.textContent = "Critical";
    } else if (battle.player.boost < 15) {
      elements.playerStatusTag.textContent = "Cooling";
    } else {
      elements.playerStatusTag.textContent = "Ready";
    }

    elements.enemyBehavior.textContent = battle.enemy.behavior;
  }

  function playTone(frequency, duration, type) {
    if (!state.audioEnabled) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    if (!state.audioContext) {
      state.audioContext = new AudioContextClass();
    }

    const audioContext = state.audioContext;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = type || "square";
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  function fireProjectile(source, target, owner) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.hypot(dx, dy) || 1;
    const inRange = distance <= source.weapon.range || owner === "enemy";

    if (!inRange) {
      if (owner === "player") {
        addLog("Target out of effective range. Close the gap or boost in.", "bad");
      }
      return false;
    }

    const spread = owner === "player" ? source.weapon.spread : 0.1;
    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * spread;
    const speed = owner === "player" ? source.weapon.projectileSpeed : 460;
    state.battle.projectiles.push({
      x: source.x + Math.cos(angle) * 26,
      y: source.y + Math.sin(angle) * 26,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      owner,
      ttl: owner === "player" ? 1.15 : 1.1,
      damage: owner === "player" ? source.damage : source.damage,
      color: owner === "player" ? "#7ce9ff" : "#ff7c87",
      radius: owner === "player" && source.weapon.id === "scrap-lancer" ? 7 : 5
    });

    if (owner === "player") {
      source.fireCooldown = source.weapon.cooldown * source.reloadPenalty;
      addLog(`Fired ${source.weapon.name}.`, "accent");
      playTone(source.weapon.id === "scrap-lancer" ? 180 : 260, 0.06, "sawtooth");
    } else {
      source.fireCooldown = 0.55;
      playTone(110, 0.08, "triangle");
    }

    return true;
  }

  function resolveHit(target, projectile) {
    const armorMitigation = target.armor * (projectile.owner === "player" ? 0.16 : 0.14);
    const damage = clamp(projectile.damage - armorMitigation + Math.random() * 4, 4, 40);
    target.hull -= damage;
    return Math.round(damage);
  }

  function triggerBoost() {
    const battle = state.battle;
    if (!battle || battle.over) {
      return;
    }

    if (battle.player.boost < 28) {
      addLog("Boost cells are still recharging.", "bad");
      return;
    }

    battle.player.boost -= 28;
    const dash = 52 * battle.player.boostMultiplier;
    battle.player.x += Math.cos(battle.player.angle) * dash;
    battle.player.y += Math.sin(battle.player.angle) * dash;
    battle.player.x = clamp(battle.player.x, 48, battle.arena.width - 48);
    battle.player.y = clamp(battle.player.y, 48, battle.arena.height - 48);
    battle.player.flash = 0.18;
    addLog("Boost engaged. You rocket across the arena.", "accent");
    playTone(420, 0.08, "sawtooth");
    updateHud();
  }

  function triggerRepair() {
    const battle = state.battle;
    if (!battle || battle.over) {
      return;
    }

    if (battle.player.repairCharges <= 0) {
      addLog("Repair kit empty. Finish the fight with armor and movement.", "bad");
      return;
    }

    if (battle.player.hull >= battle.player.maxHull - 1) {
      addLog("Hull is already topped off.", "bad");
      return;
    }

    battle.player.repairCharges -= 1;
    const healed = Math.min(battle.player.repairPower, battle.player.maxHull - battle.player.hull);
    battle.player.hull += healed;
    addLog(`Repair burst restored ${Math.round(healed)} hull.`, "good");
    playTone(520, 0.08, "triangle");
    updateHud();
  }

  function enemyThink(delta) {
    const battle = state.battle;
    const player = battle.player;
    const enemy = battle.enemy;
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    const desiredAngle = Math.atan2(dy, dx);
    const angleDifference = Math.atan2(Math.sin(desiredAngle - enemy.angle), Math.cos(desiredAngle - enemy.angle));
    enemy.angle += clamp(angleDifference, -enemy.handling * delta, enemy.handling * delta);

    let thrust = 0;
    if (distance > 240) {
      thrust = 1;
      enemy.behavior = "Closing distance";
    } else if (distance < 145) {
      thrust = -0.42;
      enemy.behavior = "Backing off to reload";
    } else {
      thrust = 0.48;
      enemy.behavior = "Strafing and firing";
      enemy.angle += Math.sin(performance.now() / 350) * 0.02;
    }

    enemy.x += Math.cos(enemy.angle) * enemy.speed * thrust * delta;
    enemy.y += Math.sin(enemy.angle) * enemy.speed * thrust * delta;
    enemy.x = clamp(enemy.x, 44, battle.arena.width - 44);
    enemy.y = clamp(enemy.y, 44, battle.arena.height - 44);

    enemy.fireCooldown = Math.max(0, enemy.fireCooldown - delta);
    if (distance < 320 && enemy.fireCooldown <= 0 && !battle.over) {
      fireProjectile(enemy, player, "enemy");
      addLog("Enemy launches a burst.", "bad");
    }
  }

  function updatePlayer(delta) {
    const battle = state.battle;
    const player = battle.player;

    const moveY = (state.input.down ? 1 : 0) - (state.input.up ? 1 : 0);
    const moveX = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);

    if (moveX || moveY) {
      const moveAngle = Math.atan2(moveY, moveX);
      const angleDelta = Math.atan2(Math.sin(moveAngle - player.angle), Math.cos(moveAngle - player.angle));
      player.angle += clamp(angleDelta, -player.handling * delta, player.handling * delta);
      const movement = player.speed * delta;
      player.x += Math.cos(moveAngle) * movement;
      player.y += Math.sin(moveAngle) * movement;
    }

    player.x = clamp(player.x, 42, battle.arena.width - 42);
    player.y = clamp(player.y, 42, battle.arena.height - 42);
    player.fireCooldown = Math.max(0, player.fireCooldown - delta);
    player.boost = clamp(player.boost + 12 * player.boostMultiplier * delta, 0, 100);
    player.flash = Math.max(0, player.flash - delta);
  }

  function updateProjectiles(delta) {
    const battle = state.battle;
    const remaining = [];
    battle.projectiles.forEach((projectile) => {
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;
      projectile.ttl -= delta;

      if (
        projectile.ttl <= 0 ||
        projectile.x < 0 ||
        projectile.x > battle.arena.width ||
        projectile.y < 0 ||
        projectile.y > battle.arena.height
      ) {
        return;
      }

      const target = projectile.owner === "player" ? battle.enemy : battle.player;
      const hitRadius = projectile.owner === "player" ? 27 : 24;
      const distance = Math.hypot(projectile.x - target.x, projectile.y - target.y);
      if (distance <= hitRadius) {
        const dealt = resolveHit(target, projectile);
        if (projectile.owner === "player") {
          addLog(`Direct hit for ${dealt} damage.`, "good");
        } else {
          battle.player.flash = 0.16;
          addLog(`Enemy clips you for ${dealt} damage.`, "bad");
        }
        playTone(projectile.owner === "player" ? 340 : 130, 0.05, "square");
        return;
      }

      remaining.push(projectile);
    });

    battle.projectiles = remaining;
  }

  function checkBattleEnd() {
    const battle = state.battle;
    if (battle.over) {
      return;
    }

    if (battle.enemy.hull <= 0) {
      battle.over = true;
      battle.winner = "player";
      addLog("Enemy chassis broken. Arena clear.", "good");
      showOverlay("victory");
    } else if (battle.player.hull <= 0) {
      battle.over = true;
      battle.winner = "enemy";
      addLog("Your vehicle is disabled. Retreat to the garage.", "bad");
      showOverlay("defeat");
    }
    updateHud();
  }

  function drawArena() {
    const battle = state.battle;
    if (!battle) {
      return;
    }

    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, elements.canvas.height);
    gradient.addColorStop(0, "#18212d");
    gradient.addColorStop(1, "#0b0f15");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);

    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 14; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? "#222d3a" : "#131921";
      ctx.fillRect(i * 72, 0, 48, elements.canvas.height);
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    for (let y = 82; y < elements.canvas.height; y += 92) {
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(elements.canvas.width - 36, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    [
      { x: 260, y: 158, r: 26 },
      { x: 502, y: 386, r: 30 },
      { x: 690, y: 160, r: 24 },
      { x: 826, y: 412, r: 22 }
    ].forEach((hazard) => {
      ctx.fillStyle = "#1d2835";
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, hazard.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.stroke();
    });

    drawVehicle(state.battle.player, state.loadout.chassis.color, state.battle.player.flash > 0);
    drawVehicle(state.battle.enemy, "#ff6d7a", false);

    state.battle.projectiles.forEach((projectile) => {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    drawNameplate(72, 48, state.battle.player.name, state.battle.player.hull / state.battle.player.maxHull, "#7cff97");
    drawNameplate(
      elements.canvas.width - 300,
      48,
      state.battle.enemy.name,
      state.battle.enemy.hull / state.battle.enemy.maxHull,
      "#ff6771"
    );
  }

  function drawVehicle(vehicle, color, flash) {
    ctx.save();
    ctx.translate(vehicle.x, vehicle.y);
    ctx.rotate(vehicle.angle);

    ctx.fillStyle = flash ? "#ffffff" : color;
    roundRect(ctx, -26, -18, 52, 36, 12, true, false);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    roundRect(ctx, -14, -12, 28, 24, 10, true, false);
    ctx.fillStyle = "#111723";
    roundRect(ctx, -30, -19, 10, 11, 6, true, false);
    roundRect(ctx, -30, 8, 10, 11, 6, true, false);
    roundRect(ctx, 20, -19, 10, 11, 6, true, false);
    roundRect(ctx, 20, 8, 10, 11, 6, true, false);

    ctx.fillStyle = "#f5c76c";
    roundRect(ctx, 12, -5, 22, 10, 5, true, false);
    ctx.restore();
  }

  function drawNameplate(x, y, label, ratio, color) {
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    roundRect(ctx, x, y, 228, 38, 14, true, false);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 16px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 14, y + 17);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    roundRect(ctx, x + 14, y + 22, 200, 8, 999, true, false);
    ctx.fillStyle = color;
    roundRect(ctx, x + 14, y + 22, clamp(ratio, 0, 1) * 200, 8, 999, true, false);
  }

  function roundRect(context, x, y, width, height, radius, fill, stroke) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
    if (fill) {
      context.fill();
    }
    if (stroke) {
      context.stroke();
    }
  }

  function tick(now) {
    state.animationFrame = requestAnimationFrame(tick);
    const delta = Math.min(0.033, (now - state.lastTime) / 1000 || 0.016);
    state.lastTime = now;

    if (!state.battle || !elements.arenaScreen.classList.contains("active")) {
      return;
    }

    if (!state.battle.over) {
      if (state.battle.introTimer > 0) {
        state.battle.introTimer -= delta;
      } else {
        updatePlayer(delta);
        enemyThink(delta);
        updateProjectiles(delta);
        checkBattleEnd();
        updateHud();
      }
    }

    drawArena();
  }

  function bindMovementButtons() {
    document.querySelectorAll("[data-control]").forEach((button) => {
      const control = button.dataset.control;
      const activate = (event) => {
        event.preventDefault();
        state.input[control] = true;
        button.classList.add("is-active");
      };
      const deactivate = () => {
        state.input[control] = false;
        button.classList.remove("is-active");
      };

      button.addEventListener("pointerdown", activate);
      button.addEventListener("pointerup", deactivate);
      button.addEventListener("pointercancel", deactivate);
      button.addEventListener("pointerleave", deactivate);
    });
  }

  function setActionFlash(button) {
    button.classList.add("is-active");
    window.setTimeout(() => button.classList.remove("is-active"), 160);
  }

  function bindActions() {
    elements.startBattle.addEventListener("click", startBattle);
    elements.restartBattle.addEventListener("click", restartBattle);
    elements.backToGarage.addEventListener("click", () => setScreen("garage"));
    elements.overlayReplay.addEventListener("click", restartBattle);
    elements.overlayGarage.addEventListener("click", () => setScreen("garage"));

    elements.fireButton.addEventListener("click", () => {
      if (!state.battle || state.battle.over) {
        return;
      }
      if (state.battle.player.fireCooldown > 0) {
        addLog("Weapons are cycling. Wait for the next burst.", "bad");
        return;
      }
      setActionFlash(elements.fireButton);
      fireProjectile(state.battle.player, state.battle.enemy, "player");
    });

    elements.boostButton.addEventListener("click", () => {
      setActionFlash(elements.boostButton);
      triggerBoost();
    });

    elements.repairButton.addEventListener("click", () => {
      setActionFlash(elements.repairButton);
      triggerRepair();
    });

    elements.toggleAudio.addEventListener("click", async () => {
      state.audioEnabled = !state.audioEnabled;
      elements.toggleAudio.textContent = `Sound: ${state.audioEnabled ? "On" : "Off"}`;
      elements.toggleAudio.setAttribute("aria-pressed", String(state.audioEnabled));
      if (state.audioEnabled && state.audioContext && state.audioContext.state === "suspended") {
        await state.audioContext.resume();
      }
    });

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "w"].includes(key)) state.input.up = true;
      if (["arrowdown", "s"].includes(key)) state.input.down = true;
      if (["arrowleft", "a"].includes(key)) state.input.left = true;
      if (["arrowright", "d"].includes(key)) state.input.right = true;
      if (key === " ") {
        event.preventDefault();
        elements.fireButton.click();
      }
      if (key === "shift") {
        elements.boostButton.click();
      }
      if (key === "r") {
        elements.repairButton.click();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "w"].includes(key)) state.input.up = false;
      if (["arrowdown", "s"].includes(key)) state.input.down = false;
      if (["arrowleft", "a"].includes(key)) state.input.left = false;
      if (["arrowright", "d"].includes(key)) state.input.right = false;
    });
  }

  refreshGarage();
  bindMovementButtons();
  bindActions();
})();
