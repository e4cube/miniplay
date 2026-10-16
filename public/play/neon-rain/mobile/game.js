function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  'use strict';

  var NeonStore = function () {
    var cache = {};
    function api() {
      try {
        return window.xhs && window.xhs.miniTool || null;
      } catch (e) {
        return null;
      }
    }
    function local() {
      try {
        return window.localStorage || null;
      } catch (e) {
        return null;
      }
    }
    function normalize(res, key) {
      if (res == null) return null;
      if (typeof res === 'string') return res;
      if (typeof res === 'object') {
        if (typeof res.data === 'string') return res.data;
        if (res.data && typeof res.data[key] === 'string') return res.data[key];
        if (typeof res[key] === 'string') return res[key];
        if (typeof res.value === 'string') return res.value;
      }
      return null;
    }
    function fromLocal(key) {
      var s = local(),
        v = null;
      try {
        v = s ? s.getItem(key) : null;
      } catch (e) {
        v = null;
      }
      if (v == null) v = cache[key] == null ? null : cache[key];
      if (v != null) cache[key] = v;
      return v;
    }
    return {
      hydrate: function (keys) {
        var a = api();
        if (!(a && a.getStorage)) return Promise.resolve(false);
        return Promise.all(keys.map(function (key) {
          return Promise.resolve().then(function () {
            return a.getStorage({
              key: key
            });
          }).then(function (res) {
            var v = normalize(res, key);
            if (v != null) {
              cache[key] = v;
              return true;
            }
            fromLocal(key);
            return false;
          }).catch(function () {
            fromLocal(key);
            return false;
          });
        })).then(function (r) {
          return r.indexOf(true) >= 0;
        }).catch(function () {
          return false;
        });
      },
      getItem: function (key) {
        if (cache[key] != null) return cache[key];
        return fromLocal(key);
      },
      setItem: function (key, value) {
        cache[key] = value;
        try {
          var s = local();
          if (s) s.setItem(key, value);
        } catch (e) {}
        var a = api();
        if (a && a.setStorage) {
          try {
            Promise.resolve(a.setStorage({
              key: key,
              data: value
            })).catch(function () {});
          } catch (e) {}
        }
      }
    };
  }();
  function noop() {}
  function ensureAudio() {
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try {
      return new Ctor();
    } catch (e) {
      return null;
    }
  }
  function scrollToShell() {
    var el = document.querySelector('.game-shell');
    if (!el || !el.scrollIntoView) return;
    try {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } catch (e) {
      try {
        el.scrollIntoView();
      } catch (e2) {}
    }
  }
  (function () {
    try {
      var flex = document.createElement('div');
      flex.style.position = 'absolute';
      flex.style.visibility = 'hidden';
      flex.style.display = 'flex';
      flex.style.flexDirection = 'column';
      flex.style.rowGap = '1px';
      flex.appendChild(document.createElement('div'));
      flex.appendChild(document.createElement('div'));
      document.body.appendChild(flex);
      var ok = flex.scrollHeight === 1;
      if (flex.parentNode) flex.parentNode.removeChild(flex);
      if (ok) document.documentElement.classList.add('supports-flex-gap');
    } catch (e) {}
  })();
  (function () {
    var probe = document.createElement('dialog');
    if (typeof probe.showModal === 'function') return;
    var style = document.createElement('style');
    style.textContent = 'dialog.poly-dialog-modal{position:fixed;left:50%;top:50%;' + 'transform:translate(-50%,-50%);z-index:1001;max-height:85vh;overflow:auto;display:block}' + 'dialog.poly-dialog-modal+.poly-dialog-backdrop,.poly-dialog-backdrop{position:fixed;' + 'top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.7);z-index:1000}';
    document.head.appendChild(style);
    var stack = [];
    function backdrop(dlg) {
      var el = document.createElement('div');
      el.className = 'poly-dialog-backdrop';
      el.setAttribute('data-for', dlg.id || '');
      dlg.parentNode.insertBefore(el, dlg);
      el.onclick = function () {
        dlg.close();
      };
      return el;
    }
    function patch(dlg) {
      if (!dlg || dlg.__polyDialog) return;
      dlg.__polyDialog = true;
      dlg.setAttribute('role', 'dialog');
      var veil = null,
        restore = null;
      if (!dlg.hasAttribute('open')) dlg.style.display = 'none';
      dlg.show = function () {
        dlg.setAttribute('open', '');
        dlg.style.display = '';
      };
      dlg.showModal = function () {
        if (dlg.hasAttribute('open')) return;
        restore = document.activeElement;
        dlg.setAttribute('open', '');
        dlg.style.display = '';
        dlg.classList.add('poly-dialog-modal');
        if (!veil) veil = backdrop(dlg);
        stack.push(dlg);
        if (dlg.querySelector('button,textarea')) {
          var first = dlg.querySelector('button,textarea');
          if (first.focus) first.focus();
        }
      };
      dlg.close = function (value) {
        if (value !== undefined) dlg.returnValue = value;
        dlg.removeAttribute('open');
        dlg.style.display = 'none';
        dlg.classList.remove('poly-dialog-modal');
        if (veil && veil.parentNode) veil.parentNode.removeChild(veil);
        veil = null;
        var i = stack.indexOf(dlg);
        if (i >= 0) stack.splice(i, 1);
        if (restore && restore.focus) restore.focus();
      };
    }
    document.addEventListener('keydown', function (event) {
      if ((event.key === 'Escape' || event.keyCode === 27) && stack.length) stack[stack.length - 1].close();
    });
    function scan() {
      var list = document.querySelectorAll('dialog');
      for (var i = 0; i < list.length; i++) patch(list[i]);
    }
    scan();
    if (window.MutationObserver) {
      new MutationObserver(scan).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  })();
  var __M_animation_js = function () {
    const RUN_STRIDE = 108;
    function runFrame(cycles, backwards = false) {
      const frame = Math.floor((cycles % 1 + 1) % 1 * 6 + 1e-8) % 6;
      return backwards ? (6 - frame) % 6 : frame;
    }
    return {
      runFrame,
      RUN_STRIDE
    };
  }();
  var __M_progress_js = function () {
    const SAVE_KEY = 'neon-rain-v1';
    function validateSave(value) {
      if (!value || value.version !== 1 || !Number.isInteger(value.level) || value.level < 0 || value.level > 2 || !Number.isInteger(value.unlocked) || value.unlocked < value.level || value.unlocked > 2 || !Number.isFinite(value.score) || value.score < 0 || value.score > 1e8) throw Error('无效存档');
      return {
        version: 1,
        level: value.level,
        unlocked: value.unlocked,
        score: Math.floor(value.score)
      };
    }
    function encodeSave(value) {
      return btoa(JSON.stringify(validateSave(value)));
    }
    function decodeSave(code) {
      return validateSave(JSON.parse(atob(code)));
    }
    return {
      validateSave,
      encodeSave,
      decodeSave,
      SAVE_KEY
    };
  }();
  var __M_combat_js = function () {
    function playerHitbox(player) {
      return {
        x: player.prone ? player.x - 10 : player.x,
        y: player.y,
        w: player.prone ? 40 : 20,
        h: player.h
      };
    }
    function overlaps(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
    function pointInside(x, y, box) {
      return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
    }
    function setProne(player, wants, obstacles) {
      const feet = player.y + player.h;
      if (wants && player.ground && !player.climbing) {
        player.prone = true;
        player.h = 17;
        player.y = feet - 17;
      } else if (player.prone) {
        const standing = {
          x: player.x,
          y: feet - 40,
          w: 20,
          h: 40
        };
        if (!obstacles.some(o => o.hp > 0 && overlaps(standing, o))) {
          player.prone = false;
          player.h = 40;
          player.y = feet - 40;
        }
      }
    }
    function resolveObstacles(player, oldX, oldY, obstacles) {
      for (const o of obstacles) {
        if (o.hp <= 0 || !overlaps({
          x: player.x,
          y: player.y,
          w: 20,
          h: player.h
        }, o)) continue;
        if (oldY + player.h <= o.y + 2 && player.vy >= 0) {
          player.y = o.y - player.h;
          player.vy = 0;
          player.ground = true;
        } else if (oldY >= o.y + o.h - 2 && player.vy < 0) {
          player.y = o.y + o.h;
          player.vy = 0;
        } else {
          player.x = oldX + 20 <= o.x + 2 ? o.x - 20 : oldX >= o.x + o.w - 2 ? o.x + o.w : oldX;
          player.vx = 0;
        }
      }
    }
    function shieldBlocks(enemy, bullet) {
      return enemy.kind === 'shield' && enemy.guard > 0 && bullet.vx * enemy.face < 0 && bullet.y > enemy.y + 7;
    }
    function waterAt(x, water) {
      return water.find(w => x > w.x && x < w.x + w.w);
    }
    function stepWater(player, water, dt) {
      const pool = waterAt(player.x + 10, water);
      const submerged = !!pool && player.y - 12 > pool.surface;
      if (submerged) {
        player.waterTime = (player.waterTime || 0) + dt;
        if (player.waterTime > 1) {
          player.drownClock = (player.drownClock || 0) + dt;
          if (player.drownClock >= .5) {
            player.drownClock -= .5;
            const damage = Math.min(4, player.hp);
            player.hp -= damage;
            player.waterDebt = (player.waterDebt || 0) + damage;
          }
        }
      } else {
        if (player.wasSubmerged && player.hp > 0) {
          const heal = Math.min(8, Math.floor((player.waterDebt || 0) * .5));
          player.hp = Math.min(100, player.hp + heal);
          player.waterDebt = 0;
        }
        player.waterTime = 0;
        player.drownClock = 0;
      }
      player.wasSubmerged = submerged;
      player.inWater = !!pool && player.y + player.h > pool.surface;
      return submerged;
    }
    function shot(bullets, x, y, vx, vy, extra = {}) {
      bullets.push(_objectSpread({
        x,
        y,
        vx,
        vy,
        life: 5,
        friendly: false,
        damage: 14
      }, extra));
    }
    function aimed(e, p, bullets, speed = 240, spread = [0]) {
      const x = e.x + e.w / 2,
        y = e.y + e.h * .45,
        angle = Math.atan2(p.y + p.h * .45 - y, p.x + 10 - x);
      for (const a of spread) shot(bullets, x, y, Math.cos(angle + a) * speed, Math.sin(angle + a) * speed);
    }
    function horizontal(e, p, bullets, count = 1) {
      for (let i = 0; i < count; i++) shot(bullets, e.x + e.w / 2, e.y + 14 + i * 7, Math.sign(p.x - e.x) * 270, 0);
    }
    function stepEnemy(e, world, dt) {
      const {
        player: p,
        bullets,
        time,
        ground
      } = world;
      e.hurt = Math.max(0, e.hurt - dt);
      e.face = p.x < e.x ? -1 : 1;
      e.active = Math.abs(e.x - p.x) < 690;
      if (e.kind === 'sewer') {
        if (!e.emerged && Math.abs(e.x - p.x) > 250) {
          e.active = false;
          return;
        }
        e.emerge = Math.min(1, (e.emerge || 0) + dt * 1.5);
        e.y = ground - e.h * e.emerge;
        if (e.emerge < 1) {
          e.warning = '井盖异动';
          return;
        }
        e.emerged = true;
      }
      if (!e.active) return;
      e.age = (e.age || 0) + dt;
      e.cool -= dt;
      if (e.kind === 'boss') {
        stepBoss(e, world, dt);
        return;
      }
      if (e.kind === 'drone') {
        e.y = e.base + Math.sin(time * 2 + e.x * .01) * 24;
        e.x += e.face * dt * 32;
      }
      if (e.kind === 'street' || e.kind === 'sewer') e.x += e.face * dt * (e.kind === 'sewer' ? 48 : 24);
      if (e.kind === 'shield') {
        e.guard = e.age % 3.2 < 2.05 ? 1 : 0;
        e.x += e.face * dt * (e.guard ? 24 : 0);
      }
      if (e.kind === 'rusher') {
        const phase = e.age % 2.5;
        e.charging = phase > .7 && phase < 1.3;
        e.x += e.face * dt * (e.charging ? 245 : 32);
        e.warning = phase < .7 ? '突袭预警' : '';
        return;
      }
      e.warning = e.cool < .55 ? {
        sniper: '狙击锁定',
        grenadier: '榴弹预警',
        turret: '连射预警'
      }[e.kind] || '' : '';
      if (e.cool > 0) return;
      if (e.kind === 'grenadier') {
        shot(bullets, e.x + 12, e.y + 8, (p.x - e.x) / 1.05, -265, {
          gravity: 510,
          grenade: true,
          life: 1.05,
          damage: 24,
          radius: 66
        });
        e.cool = 3;
      } else if (e.kind === 'sniper') {
        aimed(e, p, bullets, 480);
        e.cool = 2.8;
      } else if (e.kind === 'turret') {
        horizontal(e, p, bullets, 2);
        e.cool = e.burst < 2 ? .18 : 2.2;
        e.burst = (e.burst + 1) % 3;
      } else if (e.kind === 'shield') {
        if (!e.guard) horizontal(e, p, bullets);
        e.cool = .7;
      } else {
        if (e.kind === 'street') horizontal(e, p, bullets);else aimed(e, p, bullets, 210 + world.level * 20, e.kind === 'drone' ? [-.07, .07] : [0]);
        e.cool = 1.5 + (e.kind === 'drone' ? .6 : 0);
      }
    }
    function stepBoss(e, world, dt) {
      var _e$previousT;
      const {
        player: p,
        bullets,
        time,
        ground
      } = world;
      const phase = e.hp <= e.maxHp * .5 ? 2 : 1;
      e.phase = phase;
      const t = e.age % (phase === 2 ? 5.4 : 6.6);
      const newCycle = t < ((_e$previousT = e.previousT) !== null && _e$previousT !== void 0 ? _e$previousT : 0);
      e.previousT = t;
      if (newCycle) e.attackIndex = (e.attackIndex || 0) + 1;
      if (e.bossType === 0) {
        e.warning = t < .85 ? '平射扫街 · 趴下' : t > 3 && t < 3.8 ? '装甲冲撞 · 跳跃' : '';
        if (t >= .85 && t < 2.7 && e.cool <= 0) {
          shot(bullets, e.x + e.w / 2, ground - 30, e.face * (phase === 2 ? 330 : 280), 0, {
            damage: 18
          });
          e.cool = phase === 2 ? .16 : .25;
        }
        if (t > 3.8 && t < 4.6) e.x += e.face * (phase === 2 ? 260 : 190) * dt;
        if (t >= 4.8 && e.cool <= 0) {
          aimed(e, p, bullets, 230, [-.2, 0, .2]);
          e.cool = .85;
        }
        e.x = Math.max(3580, Math.min(4040, e.x));
      } else if (e.bossType === 1) {
        e.warning = t < .8 ? '压力冲击 · 跳跃' : t > 2.7 && t < 3.6 ? '腐蚀榴弹 · 离开标记' : '';
        e.coreOpen = t > 1.8 && t < 3.6;
        if (t >= .8 && t < 1.6 && e.cool <= 0) {
          shot(bullets, e.x, ground - 10, -290, 0, {
            wave: true,
            damage: 22
          });
          e.cool = phase === 2 ? .26 : .42;
        }
        if (t >= 3.6 && e.cool <= 0) {
          for (const offset of phase === 2 ? [-85, 0, 85] : [0]) shot(bullets, e.x + e.w / 2, e.y, (p.x + offset - e.x) / 1.1, -290, {
            gravity: 520,
            grenade: true,
            life: 1.1,
            radius: 60,
            damage: 24
          });
          e.cool = 1.2;
        }
        e.x += Math.sin(time) * dt * 18;
      } else {
        e.x = 3850 + Math.sin(e.age * .7) * 155;
        e.y = 170 + Math.sin(e.age * 1.3) * 52;
        e.warning = t < .8 ? '扇形弹幕 · 寻找空隙' : t > 2.7 && t < 3.6 ? '垂直轰炸 · 持续移动' : '';
        if (t >= .8 && t < 2.7 && e.cool <= 0) {
          aimed(e, p, bullets, phase === 2 ? 260 : 210, phase === 2 ? [-.45, -.225, 0, .225, .45] : [-.3, 0, .3]);
          e.cool = .8;
        }
        if (t >= 3.6 && e.cool <= 0) {
          for (const offset of phase === 2 ? [-65, 0, 65] : [-40, 40]) shot(bullets, p.x + offset, 70, 0, 155, {
            gravity: 190,
            grenade: true,
            life: 2,
            radius: 48,
            damage: 23
          });
          e.cool = .95;
        }
      }
    }
    return {
      playerHitbox,
      overlaps,
      pointInside,
      setProne,
      resolveObstacles,
      shieldBlocks,
      waterAt,
      stepWater,
      stepEnemy
    };
  }();
  var __M_level_design_js = function () {
    const BOSS_NAMES = ['赤犬 · 街区镇压车', '渊井 · 高压泵蛛', '天幕 · 中继炮艇'];
    const ENEMY_STATS = {
      street: {
        hp: 4,
        w: 24,
        h: 40
      },
      sewer: {
        hp: 3,
        w: 24,
        h: 38
      },
      room: {
        hp: 4,
        w: 24,
        h: 40
      },
      drone: {
        hp: 3,
        w: 36,
        h: 24
      },
      shield: {
        hp: 6,
        w: 30,
        h: 44
      },
      rusher: {
        hp: 3,
        w: 24,
        h: 42
      },
      grenadier: {
        hp: 4,
        w: 26,
        h: 44
      },
      sniper: {
        hp: 3,
        w: 24,
        h: 44
      },
      turret: {
        hp: 6,
        w: 40,
        h: 30
      }
    };
    function buildLevel(level, ground = 466) {
      const positions = [[330, 740, 1060, 1430, 1800, 2150, 2470, 2840, 3160], [350, 670, 1070, 1410, 1750, 2100, 2470, 2830, 3170], [310, 710, 1080, 1440, 1790, 2150, 2500, 2840, 3160]][level];
      const heights = [[326, 360, 298, 335, 288, 350, 305, 345, 285], [350, 294, 330, 280, 345, 310, 355, 288, 330], [310, 270, 345, 290, 345, 265, 310, 278, 340]][level];
      const sets = [['street', 'rusher', 'shield', 'sewer', 'street', 'rusher', 'shield', 'grenadier', 'turret'], ['sewer', 'grenadier', 'turret', 'sewer', 'shield', 'grenadier', 'turret', 'sewer', 'rusher'], ['shield', 'sniper', 'drone', 'grenadier', 'drone', 'sniper', 'shield', 'drone', 'turret']];
      const platforms = [],
        ladders = [],
        enemies = [],
        obstacles = [],
        hazards = [];
      for (let i = 0; i < 9; i++) {
        const x = positions[i],
          y = heights[i],
          group = Math.floor(i / 3);
        platforms.push({
          x,
          y,
          w: 185 + i % 2 * 45
        });
        ladders.push({
          x: x + 37,
          y,
          bottom: ground
        });
        const kind = sets[level][i];
        enemies.push({
          x: x + 125,
          y: kind === 'drone' ? 170 : ground - ENEMY_STATS[kind].h,
          kind,
          group
        });
        if (i % 2 === 0) enemies.push({
          x: x + 120,
          y: y - (i % 4 === 0 ? 40 : 44),
          kind: i % 4 === 0 ? 'room' : 'sniper',
          group
        });
        if (i % 3 === 1) enemies.push({
          x: x + 235,
          y: 150 + i % 2 * 30,
          kind: 'drone',
          group
        });
        obstacles.push({
          x: x + 220,
          y: ground - (i % 2 ? 42 : 32),
          w: i % 2 ? 58 : 52,
          h: i % 2 ? 42 : 32,
          hp: 8,
          maxHp: 8,
          kind: 'crate'
        });
      }
      for (const x of [1280, 2380, 3350]) obstacles.push({
        x,
        y: ground - 52,
        w: 58,
        h: 52,
        hp: Infinity,
        maxHp: Infinity,
        kind: 'barrier'
      });
      if (level === 1) {
        for (const x of [900, 2052, 3204]) hazards.push({
          x,
          y: ground - 5,
          w: 110,
          h: 5,
          kind: 'electric',
          cycle: 1,
          offset: 0,
          alwaysOn: true
        });
        for (const x of [1660, 2670]) hazards.push({
          x,
          y: ground - 5,
          w: 55,
          h: 5,
          kind: 'steam',
          cycle: 4.8,
          offset: x / 1000
        });
        obstacles.push({
          x: 1510,
          y: ground - 73,
          w: 90,
          h: 47,
          hp: Infinity,
          maxHp: Infinity,
          kind: 'barrier'
        });
      }
      if (level === 2) for (const x of [950, 2030, 3030]) hazards.push({
        x,
        y: ground - 5,
        w: 70,
        h: 5,
        kind: 'electric',
        cycle: 4.2,
        offset: x / 1000
      });
      for (const [index, x] of [170, 1320, 2340].entries()) {
        const firstY = ground - 58;
        platforms.push({
          x,
          y: firstY,
          w: 115,
          kind: 'awning'
        }, {
          x: x + 105,
          y: firstY - 58,
          w: 110,
          kind: 'cornice'
        }, {
          x: x + 205,
          y: firstY - 116,
          w: 120,
          kind: 'awning'
        });
        if (level === 2) platforms.push({
          x: x + 310,
          y: firstY - 164,
          w: 150,
          kind: 'cornice'
        });
      }
      const water = level === 1 ? [{
        x: 1140,
        w: 180,
        surface: ground - 11,
        bottom: ground + 62
      }, {
        x: 2235,
        w: 165,
        surface: ground - 11,
        bottom: ground + 62
      }] : [];
      if (level === 1) {
        for (let i = obstacles.length - 1; i >= 0; i--) if (water.some(w => obstacles[i].x < w.x + w.w && obstacles[i].x + obstacles[i].w > w.x)) obstacles.splice(i, 1);
        for (const w of water) platforms.push({
          x: w.x + 45,
          y: ground - 65,
          w: 85,
          kind: 'cornice'
        });
        for (const e of enemies) {
          const stat = ENEMY_STATS[e.kind];
          if (e.y + stat.h === ground && water.some(w => e.x + stat.w > w.x && e.x < w.x + w.w)) {
            const pool = water.find(w => e.x + stat.w > w.x && e.x < w.x + w.w);
            e.x = pool.x - stat.w - 20;
          }
        }
      }
      const encounters = [{
        group: 0,
        left: 260,
        right: 1370,
        trigger: 590,
        name: ['夜市夹击', '排水口伏击', '屋顶交叉火力'][level]
      }, {
        group: 1,
        left: 1390,
        right: 2440,
        trigger: 1660,
        name: ['装甲封锁', '高压检修廊', '狙击长廊'][level]
      }, {
        group: 2,
        left: 2460,
        right: 3490,
        trigger: 2710,
        name: ['东街防线', '泵房警戒线', '中继塔守备'][level]
      }, {
        group: 3,
        left: 3510,
        right: 4175,
        trigger: 3560,
        name: BOSS_NAMES[level]
      }].map(e => _objectSpread(_objectSpread({}, e), {}, {
        active: false,
        cleared: false
      }));
      enemies.push({
        x: level === 2 ? 3890 : 3900,
        y: level === 2 ? 185 : ground - (level === 1 ? 78 : 66),
        kind: 'boss',
        group: 3,
        bossType: level
      });
      return {
        platforms,
        ladders,
        enemies,
        obstacles,
        hazards,
        water,
        encounters
      };
    }
    return {
      buildLevel,
      BOSS_NAMES,
      ENEMY_STATS
    };
  }();
  var __M_assets_js = function () {
    const ART = {};
    async function loadArt(onProgress = () => {}) {
      const entries = ['market', 'underground', 'rooftop', 'atlas', 'story', 'courier-run', 'combat-atlas', 'environment-atlas', 'gamevado-graffiti'];
      let loaded = 0;
      await Promise.all(entries.map(name => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          ART[name] = image;
          onProgress(++loaded / entries.length);
          resolve();
        };
        image.onerror = () => reject(new Error(`无法加载美术资源：${name}`));
        image.src = `assets/${name}.webp`;
      })));
    }
    const crops = [[89, 65, 176, 260], [360, 65, 235, 265], [680, 64, 226, 264], [1030, 55, 190, 253], [47, 353, 246, 296], [357, 387, 259, 262], [652, 340, 325, 310], [964, 393, 283, 207], [0, 746, 377, 185], [424, 648, 102, 304], [612, 777, 396, 134], [1027, 655, 180, 299], [73, 1015, 196, 170], [410, 985, 124, 220], [656, 1028, 239, 156], [980, 1025, 229, 160]];
    function sprite(ctx, cell, x, y, width, height, flip = false) {
      const atlas = ART.atlas;
      if (!atlas) return;
      const [sx, sy, sw, sh] = crops[cell];
      const scale = atlas.naturalWidth / 1254;
      ctx.save();
      ctx.translate(Math.round(x + (flip ? width : 0)), Math.round(y));
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(atlas, sx * scale, sy * scale, sw * scale, sh * scale, 0, 0, width, height);
      ctx.restore();
    }
    function runningSprite(ctx, frame, centerX, feetY, flip = false) {
      const sheet = ART['courier-run'];
      if (!sheet) return;
      const width = sheet.naturalWidth / 3,
        height = sheet.naturalHeight / 2;
      ctx.save();
      ctx.translate(Math.round(centerX), Math.round(feetY));
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(sheet, frame % 3 * width, Math.floor(frame / 3) * height, width, height, -34, -66, 68, 68);
      ctx.restore();
    }
    const combatCrops = [[27, 201, 364, 126], [423, 202, 366, 124], [849, 67, 270, 263], [1220, 82, 303, 252], [43, 381, 304, 277], [409, 400, 382, 259], [800, 447, 337, 211], [1180, 473, 327, 181], [8, 707, 393, 260], [401, 705, 430, 267], [786, 677, 405, 272], [1182, 778, 325, 185]];
    function combatSprite(ctx, cell, x, y, width, height, flip = false) {
      const sheet = ART['combat-atlas'];
      if (!sheet) return;
      const [sx, sy, sw, sh] = combatCrops[cell],
        scale = sheet.naturalWidth / 1536;
      ctx.save();
      ctx.translate(Math.round(x + (flip ? width : 0)), Math.round(y));
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(sheet, sx * scale, sy * scale, sw * scale, sh * scale, 0, 0, width, height);
      ctx.restore();
    }
    const envCrops = [[32, 196, 452, 185], [540, 102, 470, 300], [1032, 87, 499, 340], [5, 552, 501, 385], [580, 513, 433, 478], [1097, 501, 383, 511]];
    function environmentSprite(ctx, cell, x, y, width, height) {
      const sheet = ART['environment-atlas'];
      if (!sheet) return;
      const [sx, sy, sw, sh] = envCrops[cell],
        scale = sheet.naturalWidth / 1536;
      ctx.drawImage(sheet, sx * scale, sy * scale, sw * scale, sh * scale, Math.round(x), Math.round(y), width, height);
    }
    return {
      loadArt,
      sprite,
      runningSprite,
      combatSprite,
      environmentSprite,
      ART
    };
  }();
  var loadArt = __M_assets_js.loadArt;
  var sprite = __M_assets_js.sprite;
  var runningSprite = __M_assets_js.runningSprite;
  var combatSprite = __M_assets_js.combatSprite;
  var environmentSprite = __M_assets_js.environmentSprite;
  var ART = __M_assets_js.ART;
  var runFrame = __M_animation_js.runFrame;
  var RUN_STRIDE = __M_animation_js.RUN_STRIDE;
  var buildLevel = __M_level_design_js.buildLevel;
  var BOSS_NAMES = __M_level_design_js.BOSS_NAMES;
  var ENEMY_STATS = __M_level_design_js.ENEMY_STATS;
  var __M_renderer_js = function () {
    const W = 960,
      H = 540,
      G = 466;
    const noise = n => {
      const value = Math.sin(n * 127.1 + 31.7) * 43758.5453;
      return value - Math.floor(value);
    };
    function box(ctx, x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    function label(ctx, s, x, y, size = 12, color = '#dbeee9', align = 'left') {
      ctx.font = `${size}px 'Space Grotesk', 'Noto Sans SC', sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(s, x, y);
      ctx.textAlign = 'left';
    }
    function glow(ctx, x, y, r, color) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    function render(ctx, game) {
      const {
        level,
        camera,
        time,
        state,
        player,
        enemies,
        bullets,
        particles,
        drops,
        platforms,
        ladders,
        obstacles,
        hazards,
        water,
        explosions,
        activeEncounter,
        score,
        killed,
        total,
        length,
        mouse,
        flash
      } = game;
      ctx.imageSmoothingEnabled = false;
      box(ctx, 0, 0, W, H, '#09121c');
      const bg = ART[['market', 'underground', 'rooftop'][level]];
      if (bg) {
        const tileWidth = 1152,
          tileHeight = tileWidth * bg.naturalHeight / bg.naturalWidth;
        const groundRatio = [.795, .691, .720][level];
        const y = G - tileHeight * groundRatio;
        const offset = camera;
        for (let i = Math.floor(offset / tileWidth); i <= Math.ceil((offset + W) / tileWidth); i++) {
          ctx.drawImage(bg, i * tileWidth - offset, y, tileWidth, tileHeight);
        }
        ctx.save();
        ctx.globalAlpha = .13;
        ctx.filter = 'blur(2px)';
        ctx.drawImage(bg, 0, 0, bg.naturalWidth, bg.naturalHeight * .25, -camera * .02, 0, W + 90, 115);
        ctx.restore();
      }
      if (level === 0 && ART['gamevado-graffiti']) {
        ctx.save();
        ctx.globalAlpha = .62;
        ctx.drawImage(ART['gamevado-graffiti'], 948 - camera, 380, 78, 30);
        ctx.restore();
      }
      for (const p of platforms) {
        if (p.x - camera > W + 100 || p.x + p.w - camera < 0) continue;
        if (p.kind === 'awning') environmentSprite(ctx, 2, p.x - camera, p.y - 8, p.w, 52);else if (p.kind === 'cornice') environmentSprite(ctx, 3, p.x - camera, p.y - 30, p.w, 80);else sprite(ctx, 10, p.x - camera, p.y - 32, p.w, 48);
      }
      for (const pool of water) {
        const x = pool.x - camera;
        box(ctx, x, pool.surface, pool.w, pool.bottom - pool.surface, '#081d29');
        environmentSprite(ctx, 4, x + pool.w - 45, pool.surface + 5, 46, 64);
        label(ctx, '深水 / W 上浮', x + pool.w / 2, pool.surface - 18, 9, '#8bcfd5', 'center');
      }
      for (const e of enemies) if (e.kind === 'sewer') environmentSprite(ctx, e.emerge > 0 ? 1 : 0, e.spawnX - camera - 15, G - (e.emerge > 0 ? 15 : 5), 57, e.emerge > 0 ? 23 : 12);
      for (const l of ladders) {
        if (l.x - camera > W + 40 || l.x - camera < -40) continue;
        sprite(ctx, 9, l.x - camera - 12, l.y, 25, l.bottom - l.y);
      }
      for (const o of obstacles) {
        if (o.hp <= 0 || o.x - camera > W + 100 || o.x + o.w - camera < 0) continue;
        combatSprite(ctx, o.kind === 'crate' ? 7 : 11, o.x - camera, o.y, o.w, o.h);
        if (o.kind === 'crate' && o.hp < o.maxHp) {
          box(ctx, o.x - camera, o.y - 5, o.w * o.hp / o.maxHp, 2, '#ffcc88');
        }
      }
      for (const h of hazards) {
        const x = h.x - camera;
        box(ctx, x, h.y, h.w, 4, h.warning ? '#ffc568' : '#588789');
        if (h.kind === 'electric') environmentSprite(ctx, 5, x + h.w - 23, G - 70, 40, 69);
        if (h.warning) {
          glow(ctx, x + h.w / 2, G - 20, 45, h.on ? '#6dffd899' : '#ffbb5533');
          label(ctx, h.kind === 'steam' ? '高压蒸汽' : '高压危险 · 跳过', x + h.w / 2, G - 80, 9, '#ffd091', 'center');
        }
        if (h.on) {
          ctx.strokeStyle = '#8effd4';
          for (let j = 0; j < 7; j++) {
            ctx.beginPath();
            ctx.moveTo(x + j * h.w / 7, G);
            ctx.lineTo(x + j * h.w / 7 + Math.sin(time * 22 + j) * 8, G - (h.kind === 'electric' ? 13 : 49));
            ctx.stroke();
          }
        }
      }
      if (activeEncounter) {
        for (const x of [activeEncounter.left, activeEncounter.right]) {
          box(ctx, x - camera, 180, 3, G - 180, '#ff526f77');
          glow(ctx, x - camera, 350, 40, '#fa507533');
        }
        label(ctx, `封锁战 / ${activeEncounter.name} · 清除本区敌人`, W / 2, 98, 11, '#ffd2a7', 'center');
      }
      const exit = length - 65 - camera;
      if (exit < W + 100) {
        glow(ctx, exit, G - 50, 85, '#b0ffb94d');
        sprite(ctx, 13, exit - 15, G - 75, 30, 69);
        label(ctx, enemies[enemies.length - 1].hp > 0 ? '击败守卫' : '前往信标 →', exit, G - 93, 11, '#baffd1', 'center');
      }
      for (const e of enemies) {
        if (e.hp <= 0 || e.x - camera < -120 || e.x - camera > W + 120) continue;
        if (e.kind === 'sewer' && !e.active) continue;
        const cell = {
          street: 4,
          sewer: 5,
          room: 4,
          drone: 7,
          boss: 6
        }[e.kind];
        const height = e.kind === 'boss' ? [91, 102, 94][e.bossType] : e.kind === 'drone' ? 41 : e.kind === 'turret' ? 39 : 57;
        const width = e.kind === 'boss' ? [139, 146, 159][e.bossType] : e.kind === 'drone' ? 61 : e.kind === 'turret' ? 53 : 49;
        const bob = e.kind === 'drone' ? 0 : Math.abs(Math.sin(time * 6 + e.x)) * .8;
        ctx.save();
        if (e.kind === 'sewer') {
          ctx.beginPath();
          ctx.rect(e.x - camera - 40, 0, 120, G);
          ctx.clip();
        }
        if (e.hurt > 0) ctx.filter = 'brightness(2)';
        const extra = {
          shield: 2,
          rusher: 3,
          grenadier: 4,
          sniper: 5,
          turret: 6,
          boss: 8 + e.bossType
        }[e.kind];
        if (extra !== undefined) combatSprite(ctx, extra, e.x - camera + (e.w - width) / 2, e.y + e.h - height + bob, width, height, e.face < 0);else sprite(ctx, cell, e.x - camera + (e.w - width) / 2, e.y + e.h - height + bob, width, height, e.face < 0);
        ctx.restore();
        if (e.kind === 'boss' || e.hurt > 0) {
          box(ctx, e.x - camera - 4, e.y - 21, e.w + 8, 3, '#07111f');
          box(ctx, e.x - camera - 4, e.y - 21, (e.w + 8) * e.hp / e.maxHp, 3, '#ff719d');
        }
        if (e.kind === 'boss') label(ctx, BOSS_NAMES[e.bossType], e.x - camera + e.w / 2, e.y - 30, 10, '#ffc4d7', 'center');
        if (e.warning) label(ctx, e.warning, e.x - camera + e.w / 2, e.y - 44, 9, '#ffd18d', 'center');
        if (e.kind === 'sniper' && e.cool < .55) {
          ctx.strokeStyle = '#ff607788';
          ctx.setLineDash([5, 6]);
          ctx.beginPath();
          ctx.moveTo(e.x - camera + 12, e.y + 15);
          ctx.lineTo(player.x - camera + 10, player.y + player.h / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (e.kind === 'shield' && e.guard) glow(ctx, e.x - camera + e.w / 2 + e.face * 16, e.y + 24, 25, '#77eaff44');
        if (e.kind === 'boss' && e.bossType === 1 && e.coreOpen) glow(ctx, e.x - camera + e.w / 2, e.y + 30, 45, '#a0ff8580');
        if (e.cool < .3 && e.active) glow(ctx, e.x - camera + e.w / 2, e.y + 16, 17, '#fa688b44');
      }
      for (const d of drops) {
        const y = d.y + Math.sin(time * 4) * 3;
        glow(ctx, d.x - camera + 9, y + 9, 25, '#8cffca44');
        sprite(ctx, {
          heal: 12,
          shield: 13,
          spread: 14,
          rapid: 15
        }[d.kind], d.x - camera - 3, y - 3, 25, 25);
      }
      if (!(player.inv > 0 && Math.floor(time * 15) % 2 === 0)) {
        const running = (Math.abs(player.vx) > 20 || player.depthMoving) && player.ground && !player.climbing && player.dashTime <= 0;
        const cell = !player.ground && !player.climbing ? 3 : 0;
        ctx.save();
        if (player.dashTime > 0) {
          ctx.globalAlpha = .28;
          sprite(ctx, cell, player.x - camera - 22 - player.face * 20, player.y - 16, 52, 59, player.face < 0);
          ctx.globalAlpha = 1;
        }
        ctx.shadowColor = '#6ef5dc';
        ctx.shadowBlur = 4;
        if (player.prone) combatSprite(ctx, Math.abs(player.vx) > 5 ? Math.floor(time * 7) % 2 : 0, player.x - camera - 21, player.y - 4, 65, 23, player.face < 0);else if (running) runningSprite(ctx, runFrame(player.anim, player.vx * player.face < 0), player.x - camera + 10, player.y + 40, player.face < 0);else sprite(ctx, cell, player.x - camera - 16, player.y - 16, 52, 59, player.face < 0);
        ctx.restore();
        if (player.shield > 0) {
          ctx.strokeStyle = '#7fffd580';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(player.x - camera + 10, player.y + 20, 25, 34, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      for (const pool of water) {
        const x = pool.x - camera;
        box(ctx, x, pool.surface, pool.w, pool.bottom - pool.surface, '#276e844d');
        ctx.strokeStyle = '#83cfdfb0';
        ctx.beginPath();
        for (let j = 0; j <= pool.w; j += 5) {
          const y = pool.surface + Math.sin(time * 3 + j * .09) * 1.6;
          if (j === 0) ctx.moveTo(x + j, y);else ctx.lineTo(x + j, y);
        }
        ctx.stroke();
      }
      for (const b of bullets) {
        ctx.strokeStyle = b.friendly ? '#cbffe6' : b.grenade ? '#ffc66d' : '#ff6d96';
        ctx.lineWidth = b.friendly ? 2 : b.wave ? 9 : 3;
        ctx.beginPath();
        ctx.moveTo(b.x - camera, b.y);
        ctx.lineTo(b.x - camera - b.vx * .011, b.y - b.vy * .011);
        ctx.stroke();
        glow(ctx, b.x - camera, b.y, b.grenade ? 16 : 8, b.friendly ? '#aaffdf44' : '#ff668c44');
        if (b.grenade) {
          const landingX = b.x + b.vx * Math.max(0, b.life);
          ctx.strokeStyle = '#ffb25888';
          ctx.beginPath();
          ctx.ellipse(landingX - camera, G - 4, b.radius || 55, 5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      for (const e of explosions) {
        glow(ctx, e.x - camera, e.y, e.r, `rgba(255,155,75,${e.life * 2})`);
        ctx.strokeStyle = '#ffcc9a';
        ctx.beginPath();
        ctx.arc(e.x - camera, e.y, e.r * (1 - e.life / .3), 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        box(ctx, p.x - camera, p.y, p.size, p.size, p.c);
      }
      ctx.globalAlpha = 1;
      if (level !== 1) {
        ctx.save();
        ctx.filter = 'blur(1.7px)';
        for (let i = 0; i < 2; i++) {
          const x = ((time * (i ? 122 : -158) + i * 650) % (W + 450) + W + 450) % (W + 450) - 250;
          sprite(ctx, 8, x, G + 19 + i * 20, 220, 77, i === 0);
        }
        ctx.restore();
      }
      ctx.strokeStyle = level === 1 ? '#9fffe715' : '#bbdcf42a';
      ctx.lineWidth = .7;
      ctx.beginPath();
      for (let i = 0; i < (level === 1 ? 28 : 100); i++) {
        const x = ((noise(i + 7) * W - time * 75) % W + W) % W,
          y = (noise(i + 107) * H + time * (200 + noise(i) * 180)) % H;
        ctx.moveTo(x, y);
        ctx.lineTo(x - 4, y + 10);
      }
      ctx.stroke();
      const vig = ctx.createRadialGradient(W / 2, H / 2, 180, W / 2, H / 2, 620);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, '#02081588');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
      if (state === 'story' && ART.story) {
        ctx.drawImage(ART.story, 0, 0, W, H);
        box(ctx, 0, 0, W, H, '#07131a18');
      }
      if (['playing', 'paused', 'dead', 'complete'].includes(state)) {
        box(ctx, 22, 19, 211, 63, '#07131be0');
        label(ctx, 'ARAN / 阿岚', 35, 39, 11, '#baffd9');
        box(ctx, 35, 49, 150, 5, '#39414b');
        box(ctx, 35, 49, player.hp * 1.5, 5, '#b5ffd8');
        label(ctx, `${player.hp} HP`, 196, 55, 9);
        const weapon = {
          normal: '标准步枪',
          spread: '散射模块',
          rapid: '速射模块'
        }[player.weapon];
        label(ctx, player.wasSubmerged ? '缺氧！W 上浮 / 离水恢复' : `${weapon}${player.power > 0 ? ' ' + Math.ceil(player.power) + 's' : ''}  / 护盾 ${player.shield}`, 35, 71, 9, player.wasSubmerged ? '#ffb77e' : '#a4b9c1');
        box(ctx, W - 225, 19, 203, 63, '#07131be0');
        label(ctx, `SCORE ${String(score).padStart(6, '0')}`, W - 36, 40, 14, '#e6eddc', 'right');
        label(ctx, `守卫 ${killed}/${total}  ·  ${Math.round(player.x / length * 100)}%`, W - 36, 59, 10, '#afc7c6', 'right');
        label(ctx, player.dashCooldown > 0 ? '冲刺冷却' : 'SHIFT 冲刺就绪', W - 36, 73, 8, '#98b0b1', 'right');
        box(ctx, 315, 27, 330, 2, '#ffffff25');
        box(ctx, 315, 27, 330 * player.x / length, 2, '#bdffd6');
        const boss = enemies.find(e => e.kind === 'boss' && e.hp > 0 && e.active);
        if (boss) {
          box(ctx, 305, 45, 350, 5, '#192233');
          box(ctx, 305, 45, 350 * boss.hp / boss.maxHp, 5, boss.phase === 2 ? '#ff5f82' : '#d795be');
          label(ctx, `${BOSS_NAMES[boss.bossType]} / PHASE ${boss.phase}`, 480, 65, 10, '#ffd6da', 'center');
        }
        if (state === 'playing' && player.x < 260) label(ctx, game.touchMode ? '左杆移动 / 攀梯 · 右杆瞄准射击 · 按住跳跃' : 'A/D 移动 · 空格跳跃 · C 趴下 / 匍匐 · SHIFT 冲刺', W / 2, 116, 12, '#d5eee4', 'center');
        if (state === 'playing' && mouse.active) {
          ctx.strokeStyle = '#c8ffe2';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
          ctx.moveTo(mouse.x - 11, mouse.y);
          ctx.lineTo(mouse.x - 4, mouse.y);
          ctx.moveTo(mouse.x + 4, mouse.y);
          ctx.lineTo(mouse.x + 11, mouse.y);
          ctx.moveTo(mouse.x, mouse.y - 11);
          ctx.lineTo(mouse.x, mouse.y - 4);
          ctx.moveTo(mouse.x, mouse.y + 4);
          ctx.lineTo(mouse.x, mouse.y + 11);
          ctx.stroke();
        }
      }
      if (flash > 0) box(ctx, 0, 0, W, H, `rgba(255,80,130,${flash})`);
    }
    return {
      render
    };
  }();
  var __M_touch_js = function () {
    function stickVector(x, y, radius) {
      const length = Math.hypot(x, y),
        scale = length > radius ? radius / length : 1;
      return {
        x: x * scale,
        y: y * scale,
        dx: Math.abs(x) > radius * .28 ? Math.sign(x) : 0,
        dy: Math.abs(y) > radius * .28 ? Math.sign(y) : 0,
        angle: Math.atan2(y, x),
        aiming: length > radius * .18
      };
    }
    function detectMobile(host) {
      const ua = host.navigator && host.navigator.userAgent || '';
      const uaMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile|HarmonyOS/i.test(ua);
      const query = host.matchMedia ? function (q) {
        return !!(host.matchMedia(q) && host.matchMedia(q).matches);
      } : function () {
        return false;
      };
      const coarse = query('(any-pointer: coarse)');
      const small = Math.min(host.innerWidth || 0, host.innerHeight || 0) <= 900;
      const desktopOnly = !uaMobile && !coarse && query('(any-pointer: fine)');
      return uaMobile || coarse || small && !desktopOnly;
    }
    function preventBrowserZoom(root) {
      const stop = event => {
        if (event.cancelable) event.preventDefault();
      };
      for (const name of ['gesturestart', 'gesturechange', 'gestureend']) root.addEventListener(name, stop);
      root.addEventListener('touchmove', event => {
        if (event.touches && event.touches.length > 1) stop(event);
      }, {
        passive: false
      });
      root.addEventListener('dblclick', stop);
    }
    function mountTouch({
      touch,
      getState,
      getFace,
      pause,
      root = document,
      host = window
    }) {
      preventBrowserZoom(root);
      const taps = new Map();
      let lastTap = null,
        lastTapAt = 0;
      root.addEventListener('touchstart', event => {
        for (const t of Array.from(event.changedTouches || [])) {
          var _t$target, _t$target$closest;
          const button = (_t$target = t.target) === null || _t$target === void 0 || (_t$target$closest = _t$target.closest) === null || _t$target$closest === void 0 ? void 0 : _t$target$closest.call(_t$target, 'button');
          if (button && !button.disabled && !button.dataset.touchKey && button.id !== 'touch-fire' && button.id !== 'touch-prone') taps.set(t.identifier, {
            button,
            x: t.clientX,
            y: t.clientY
          });
        }
      }, true);
      root.addEventListener('touchmove', event => {
        for (const t of Array.from(event.changedTouches || [])) {
          const p = taps.get(t.identifier);
          if (p && Math.hypot(t.clientX - p.x, t.clientY - p.y) > 12) taps.delete(t.identifier);
        }
      }, true);
      root.addEventListener('touchcancel', event => {
        for (const t of Array.from(event.changedTouches || [])) taps.delete(t.identifier);
      }, true);
      root.addEventListener('touchend', event => {
        for (const t of Array.from(event.changedTouches || [])) {
          const p = taps.get(t.identifier);
          taps.delete(t.identifier);
          if (!p || p.button.disabled) continue;
          if (event.cancelable) event.preventDefault();
          lastTap = null;
          p.button.click();
          lastTap = p.button;
          lastTapAt = Date.now();
        }
      }, {
        capture: true,
        passive: false
      });
      root.addEventListener('click', event => {
        var _event$target, _event$target$closest;
        if (event.isTrusted && ((_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest = _event$target.closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, 'button')) === lastTap && Date.now() - lastTapAt < 700) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }, true);
      const mode = new URLSearchParams(host.location.search).get('mode');
      const enabled = mode ? mode === 'mobile' : detectMobile(host);
      root.body.classList.toggle('mobile-game', enabled);
      const controls = root.querySelector('#touch-controls'),
        menu = root.querySelector('#touch-menu');
      const sticks = [];
      const fireButtons = [root.querySelector('#touch-fire')];
      const actions = [...root.querySelectorAll('[data-touch-key]')];
      const pointers = new Map();
      let prone = false,
        previousState = '';
      function refresh() {
        touch.keys.clear();
        touch.firing = false;
        if (prone) touch.keys.add('c');
        for (const p of pointers.values()) {
          if (p.kind === 'fire') touch.firing = true;else touch.keys.add(p.key);
        }
        const dx = (touch.keys.has('d') ? 1 : 0) - (touch.keys.has('a') ? 1 : 0);
        const dy = (touch.keys.has('s') ? 1 : 0) - (touch.keys.has('w') ? 1 : 0);
        touch.angle = Math.atan2(dy, dx || (!dy ? getFace() : 0));
      }
      function release() {
        pointers.clear();
        prone = false;
        touch.keys.clear();
        touch.firing = false;
        for (const el of [...sticks, ...actions, ...fireButtons]) {
          el.classList.remove('held');
          el.style.setProperty('--stick-x', '0px');
          el.style.setProperty('--stick-y', '0px');
        }
        root.querySelector('#touch-prone').setAttribute('aria-pressed', 'false');
      }
      function sync(state) {
        if (state === 'playing') refresh();
        if (state === previousState) return;
        previousState = state;
        controls.hidden = state !== 'playing';
        menu.textContent = state === 'playing' ? '暂停' : '菜单';
        if (state !== 'playing') release();
      }
      if (!enabled) return {
        release,
        sync,
        enabled
      };
      let sideways = host.innerHeight > host.innerWidth;
      root.body.classList.toggle('landscape-sim', sideways);
      function applyOrientation() {
        const next = host.innerHeight > host.innerWidth;
        if (next === sideways) return;
        sideways = next;
        root.body.classList.toggle('landscape-sim', sideways);
      }
      const hasPointer = typeof host.PointerEvent === 'function';
      const downNames = hasPointer ? ['pointerdown', 'touchstart'] : ['touchstart'];
      const moveNames = hasPointer ? ['pointermove', 'touchmove'] : ['touchmove'];
      const endNames = hasPointer ? ['pointerup', 'pointercancel', 'lostpointercapture', 'touchend', 'touchcancel'] : ['touchend', 'touchcancel'];
      function changed(event) {
        return event.changedTouches ? Array.from(event.changedTouches) : [event];
      }
      function pointId(event, point) {
        return event.changedTouches ? 'touch:' + point.identifier : point.pointerId;
      }
      function drop(id) {
        const p = pointers.get(id);
        if (!p) return;
        pointers.delete(id);
        p.el.classList.remove('held');
      }
      function end(event) {
        for (const point of changed(event)) {
          drop(pointId(event, point));
          if (event.changedTouches && point.target) for (const [id, p] of pointers) {
            var _p$el$contains, _p$el;
            if (p.el === point.target || (_p$el$contains = (_p$el = p.el).contains) !== null && _p$el$contains !== void 0 && _p$el$contains.call(_p$el, point.target)) drop(id);
          }
        }
        if (event.changedTouches && event.touches) {
          const live = new Set(Array.from(event.touches).map(t => 'touch:' + t.identifier));
          for (const id of pointers.keys()) if (typeof id === 'string' && id.startsWith('touch:') && !live.has(id)) drop(id);
        }
        refresh();
      }
      for (const name of endNames) root.addEventListener(name, end, true);
      function bind(el, kind, key) {
        for (const downName of downNames) el.addEventListener(downName, event => {
          if (getState() !== 'playing' || [...pointers.values()].some(p => p.el === el)) return;
          const point = changed(event).find(t => !pointers.has(pointId(event, t)) && (!t.target || t.target === el || el.contains && el.contains(t.target)));
          if (!point) return;
          event.preventDefault();
          const id = pointId(event, point);
          if (!event.changedTouches && hasPointer && el.setPointerCapture) {
            try {
              el.setPointerCapture(id);
            } catch (_unused) {}
          }
          pointers.set(id, {
            el,
            kind,
            key
          });
          el.classList.add('held');
          refresh();
        }, {
          passive: false
        });
        for (const moveName of moveNames) el.addEventListener(moveName, event => {
          if (!['w', 'a', 's', 'd'].includes(key)) return;
          const bounds = el.getBoundingClientRect();
          for (const point of changed(event)) {
            var _pointers$get;
            const id = pointId(event, point);
            if (((_pointers$get = pointers.get(id)) === null || _pointers$get === void 0 ? void 0 : _pointers$get.el) !== el) continue;
            if (point.clientX < bounds.left || point.clientX > bounds.left + bounds.width || point.clientY < bounds.top || point.clientY > bounds.top + bounds.height) drop(id);
          }
          refresh();
        }, {
          passive: false
        });
        for (const name of endNames) el.addEventListener(name, end);
        el.addEventListener('touchstart', event => {
          if (event.cancelable) event.preventDefault();
        }, {
          passive: false
        });
      }
      bind(fireButtons[0], 'fire');
      for (const el of actions) bind(el, 'button', el.dataset.touchKey);
      const proneButton = root.querySelector('#touch-prone');
      const toggleProne = () => {
        if (getState() !== 'playing') return;
        prone = !prone;
        proneButton.setAttribute('aria-pressed', String(prone));
        refresh();
      };
      let proneTouchAt = 0;
      proneButton.addEventListener('touchstart', event => {
        event.preventDefault();
        proneTouchAt = Date.now();
        toggleProne();
      }, {
        passive: false
      });
      proneButton.onclick = () => {
        if (Date.now() - proneTouchAt > 700) toggleProne();
      };
      const options = root.querySelector('#mobile-options');
      menu.onclick = () => {
        if (getState() === 'playing') pause();
        release();
        root.querySelector('#close-mobile-options').textContent = getState() === 'paused' ? '继续游戏' : '返回';
        options.showModal();
      };
      root.querySelector('#close-mobile-options').onclick = () => {
        options.close();
        if (getState() === 'paused') pause();
      };
      for (const el of root.querySelectorAll('[data-mobile-action]')) el.onclick = () => {
        const action = el.dataset.mobileAction;
        if (action !== 'sound' && action !== 'save') options.close();
        root.querySelector(`#${action}`).click();
        if (action === 'sound') el.textContent = root.querySelector('#sound').textContent;
        if (action === 'save') el.textContent = '已保存进度';
      };
      function viewportChanged() {
        applyOrientation();
        release();
      }
      host.addEventListener('resize', viewportChanged);
      host.addEventListener('orientationchange', viewportChanged);
      host.addEventListener('blur', release);
      host.addEventListener('pagehide', release);
      root.addEventListener('visibilitychange', () => {
        if (root.hidden) release();
      });
      return {
        release,
        sync,
        enabled
      };
    }
    return {
      stickVector,
      mountTouch
    };
  }();
  var stickVector = __M_touch_js.stickVector;
  var mountTouch = __M_touch_js.mountTouch;
  var validateSave = __M_progress_js.validateSave;
  var encodeSave = __M_progress_js.encodeSave;
  var decodeSave = __M_progress_js.decodeSave;
  var SAVE_KEY = __M_progress_js.SAVE_KEY;
  var loadArt = __M_assets_js.loadArt;
  var sprite = __M_assets_js.sprite;
  var runningSprite = __M_assets_js.runningSprite;
  var combatSprite = __M_assets_js.combatSprite;
  var environmentSprite = __M_assets_js.environmentSprite;
  var ART = __M_assets_js.ART;
  var render = __M_renderer_js.render;
  var runFrame = __M_animation_js.runFrame;
  var RUN_STRIDE = __M_animation_js.RUN_STRIDE;
  var buildLevel = __M_level_design_js.buildLevel;
  var BOSS_NAMES = __M_level_design_js.BOSS_NAMES;
  var ENEMY_STATS = __M_level_design_js.ENEMY_STATS;
  var playerHitbox = __M_combat_js.playerHitbox;
  var overlaps = __M_combat_js.overlaps;
  var pointInside = __M_combat_js.pointInside;
  var setProne = __M_combat_js.setProne;
  var resolveObstacles = __M_combat_js.resolveObstacles;
  var shieldBlocks = __M_combat_js.shieldBlocks;
  var waterAt = __M_combat_js.waterAt;
  var stepWater = __M_combat_js.stepWater;
  var stepEnemy = __M_combat_js.stepEnemy;
  var __M_main_js = function () {
    function createNeonSound(makeContext) {
      let ctx,
        master,
        noise,
        enabled = false,
        active = false,
        clock = 0,
        nextAmbient = 4,
        step = 0,
        boss = null,
        lastWarning = '',
        lastPhase = 0,
        lastAttack = 0,
        attackWait = 0;
      const voices = new Set();
      function stop() {
        active = false;
        for (const v of [...voices]) {
          try {
            v.source.stop();
          } catch (_unused2) {}
          v.source.disconnect();
          v.gain.disconnect();
        }
        voices.clear();
      }
      function unlock() {
        try {
          ctx = ctx || makeContext();
          if (!ctx) return false;
          if (!master) {
            master = ctx.createGain();
            master.gain.value = .55;
            master.connect(ctx.destination);
            noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            const d = noise.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          }
          if (ctx.resume) {
            const p = ctx.resume();
            if (p && p.catch) p.catch(() => {});
          }
          return true;
        } catch (_unused3) {
          return false;
        }
      }
      function tone(freq, end, duration, volume, type = 'sine', delay = 0) {
        if (!enabled || !ctx || voices.size >= 18) return;
        try {
          const source = type === 'noise' ? ctx.createBufferSource() : ctx.createOscillator(),
            gain = ctx.createGain(),
            now = ctx.currentTime + delay;
          if (type === 'noise') {
            source.buffer = noise;
            source.loop = true;
          } else {
            source.type = type;
            source.frequency.setValueAtTime(freq, now);
            source.frequency.exponentialRampToValueAtTime(Math.max(20, end), now + duration);
          }
          gain.gain.setValueAtTime(.0001, now);
          gain.gain.linearRampToValueAtTime(volume, now + Math.min(.025, duration / 4));
          gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
          source.connect(gain);
          gain.connect(master);
          const v = {
            source,
            gain
          };
          voices.add(v);
          source.onended = () => {
            source.disconnect();
            gain.disconnect();
            voices.delete(v);
          };
          source.start(now);
          source.stop(now + duration + .02);
        } catch (_unused4) {}
      }
      function effect(name, level = 0) {
        if (!enabled || !ctx) return;
        if (name === 'shot') {
          tone(660, 150, .065, .06, 'triangle');
          tone(0, 0, .025, .018, 'noise');
        } else if (name === 'hurt') {
          tone(135, 42, .28, .15, 'sawtooth');
          tone(0, 0, .1, .055, 'noise');
        } else if (name === 'step') {
          tone(110, 45, .07, .035);
          tone(0, 0, .04, .014, 'noise');
        } else if (name === 'jump') tone(160, 400, .12, .07, 'triangle');else if (name === 'dash') {
          tone(0, 0, .16, .045, 'noise');
          tone(300, 100, .12, .04);
        } else if (name === 'pickup') {
          tone(660, 900, .13, .07);
          tone(990, 1320, .16, .05, 'sine', .09);
        } else if (name === 'kill') {
          tone(85, 30, .16, .065);
          tone(0, 0, .08, .025, 'noise');
        } else if (name === 'vehicle') {
          tone(85, 42, 2.4, .035, 'sawtooth');
          tone(0, 0, 1.7, .013, 'noise', .2);
        } else if (name === 'door') {
          tone(0, 0, .65, .026, 'noise');
          tone(420, 175, .5, .025, 'triangle');
          tone(95, 38, .12, .05, 'sine', .65);
        } else if (name === 'boss-warning') {
          tone([95, 165, 310][level], [190, 80, 620][level], .65, .095, 'sawtooth');
          tone(0, 0, .3, .027, 'noise');
        } else if (name === 'boss-attack') {
          tone([70, 220, 460][level], [30, 55, 130][level], .24, .085, level === 2 ? 'triangle' : 'sawtooth');
        } else if (name === 'boss-down') {
          tone(0, 0, 1.1, .12, 'noise');
          tone(100, 25, 1.2, .1);
        } else tone(500, 650, .09, .06);
      }
      return {
        setEnabled(value) {
          enabled = value;
          if (value) unlock();else stop();
          return enabled && !!ctx;
        },
        stop,
        effect,
        update(dt, g) {
          if (!enabled || !ctx || g.state !== 'playing') {
            if (active || voices.size) stop();
            return;
          }
          active = true;
          clock += dt;
          step -= dt;
          attackWait -= dt;
          if (clock >= nextAmbient) {
            tone(60, 60, 2.8, .012);
            if (g.level === 0) effect(Math.floor(clock / 9) % 2 ? 'door' : 'vehicle');
            nextAmbient = clock + 9 + Math.random() * 5;
          }
          const p = g.player;
          if (p.ground && !p.climbing && !p.prone && (Math.abs(p.vx) > 35 || p.depthMoving) && step <= 0) {
            effect('step');
            step = Math.abs(p.vx) > 300 ? .16 : .28;
          }
          const b = g.enemies.find(e => e.kind === 'boss' && e.hp > 0 && Math.abs(e.x - p.x) < 850);
          if (b) {
            if (b !== boss || b.warning && b.warning !== lastWarning || b.phase !== lastPhase) effect('boss-warning', g.level);
            if (b === boss && b.cool > lastAttack + .1 && attackWait <= 0) {
              effect('boss-attack', g.level);
              attackWait = .35;
            }
            lastWarning = b.warning;
            lastPhase = b.phase;
            lastAttack = b.cool;
          } else if (boss && boss.hp <= 0) effect('boss-down', g.level);
          boss = b || null;
        }
      };
    }
    function stepStreetDepth(player, direction, firing, dt, ground, enabled, inPool) {
      player.depth = player.depth || 0;
      player.depthMoving = false;
      if (!enabled || inPool) {
        player.depth = 0;
        return;
      }
      const onStreet = player.ground && Math.abs(player.y + player.h - ground - player.depth) < 2;
      if (!onStreet || player.climbing || player.prone || firing || player.dashTime > 0) return;
      const previous = player.depth;
      player.depth = Math.max(0, Math.min(28, previous + direction * 55 * dt));
      player.y += player.depth - previous;
      player.depthMoving = player.depth !== previous;
      player.anim += Math.abs(player.depth - previous) / 24;
    }
    const $ = s => document.querySelector(s),
      canvas = $('#game'),
      ctx = canvas.getContext('2d');
    const W = 960,
      H = 540,
      G = 466,
      LENGTH = 4200,
      STEP = 1 / 120,
      keys = new Set();
    const touch = {
      keys: new Set(),
      firing: false,
      angle: 0
    };
    let touchControls;
    const pressed = key => keys.has(key) || touch.keys.has(key);
    const levels = [{
      name: '雨巷夜市',
      speaker: '老陈 / 修理铺',
      story: ['「阿岚，听得到吗？」老陈把最后一枚电芯塞进你的掌心。', '企业切断了街区供电。面馆老板还守着那锅热汤，诊所里还有人等着。', '穿过夜市，击败东侧守卫。把电芯带到中继塔——他们的灯，就靠你了。']
    }, {
      name: '地下暗流',
      speaker: '老陈 / 无线电',
      story: ['地上的招牌熄灭了，地下的机器却还在轰鸣。', '「不是故障。他们把整条街的电，都送进了自己的中继塔。」', '循着绿色检修灯前进。外梯能避开地面火力，小心从管道里冒出的守卫。']
    }, {
      name: '天际防线',
      speaker: '阿岚 / 最后一程',
      story: ['走出检修口，雨水又落在你的目镜上。远处中继塔的灯从未熄灭。', '「老陈，等我回来，你那台旧收音机……该修好了吧？」耳机里传来一声笑。', '击败重装守卫，把电芯接入信标。今晚，这座城该为自己亮一次灯。']
    }];
    let state = 'loading',
      level = 0,
      unlocked = 0,
      score = 0,
      camera = 0,
      time = 0,
      killed = 0,
      total = 0,
      shot = 0;
    let player,
      enemies = [],
      bullets = [],
      particles = [],
      drops = [],
      platforms = [],
      ladders = [];
    let obstacles = [],
      hazards = [],
      water = [],
      encounters = [],
      explosions = [],
      activeEncounter = null;
    const soundscape = createNeonSound(ensureAudio);
    let storyStep = 0,
      muted = true,
      audio,
      shake = 0,
      flash = 0,
      jumpBuffer = 0,
      artReady = false,
      checkpointScore = 0;
    let mouse = {
        x: 600,
        y: 260,
        down: false,
        active: false
      },
      input = {
        jumpHeld: false,
        dash: false
      };
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const approach = (value, target, amount) => value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
    const rand = n => {
      const v = Math.sin(n * 127.1 + 31.7) * 43758.5453;
      return v - Math.floor(v);
    };
    function beep(f = 220, len = .06) {
      if (muted) return;
      const name = {
        90: "hurt",
        430: "shot",
        200: "jump",
        330: "dash",
        120: "kill",
        660: "pickup"
      }[f] || "ui";
      soundscape.effect(name, level);
    }
    function hydrateThenArt(onProgress) {
      return NeonStore.hydrate([SAVE_KEY]).catch(noop).then(function () {
        return loadArt(onProgress);
      });
    }
    function toast(message) {
      var feedback = document.querySelector("#minitool-feedback");
      if (feedback) feedback.textContent = message;
      var menuFeedback = document.querySelector("#minitool-menu-feedback");
      if (menuFeedback) menuFeedback.textContent = message;
      $('#toast').textContent = message;
      $('#toast').style.opacity = 1;
      clearTimeout(toast.timer);
      toast.timer = setTimeout(() => $('#toast').style.opacity = 0, 3200);
    }
    function load() {
      try {
        return validateSave(JSON.parse(NeonStore.getItem(SAVE_KEY)));
      } catch (_unused5) {
        return null;
      }
    }
    function save(quiet = false) {
      const value = {
        version: 1,
        level,
        unlocked,
        score
      };
      try {
        NeonStore.setItem(SAVE_KEY, JSON.stringify(value));
        if (!quiet) toast('进度已保存 · 从本区域起点继续');
      } catch (_unused6) {
        toast('本地存储不可用，可复制分享存档码');
      }
      return value;
    }
    function reset(n) {
      var _touchControls;
      level = n;
      camera = 0;
      killed = 0;
      shot = 0;
      shake = 0;
      flash = 0;
      jumpBuffer = 0;
      checkpointScore = score;
      keys.clear();
      (_touchControls = touchControls) === null || _touchControls === void 0 || _touchControls.release();
      mouse.down = false;
      input.jumpHeld = false;
      input.dash = false;
      bullets = [];
      particles = [];
      drops = [];
      enemies = [];
      explosions = [];
      activeEncounter = null;
      player = {
        depth: n === 0 ? 24 : 0,
        x: 90,
        y: G - 40 + (n === 0 ? 24 : 0),
        w: 20,
        h: 40,
        prone: false,
        vx: 0,
        vy: 0,
        hp: 100,
        shield: 0,
        inv: 0,
        weapon: 'normal',
        power: 0,
        face: 1,
        ground: true,
        climbing: false,
        coyote: .12,
        anim: 0,
        dashTime: 0,
        dashCooldown: 0,
        dropThrough: 0
      };
      const design = buildLevel(level, G);
      ({
        platforms,
        ladders,
        obstacles,
        hazards,
        water,
        encounters
      } = design);
      for (const e of design.enemies) {
        var _ENEMY_STATS$e$kind;
        addEnemy(e.x, e.y, e.kind, (((_ENEMY_STATS$e$kind = ENEMY_STATS[e.kind]) === null || _ENEMY_STATS$e$kind === void 0 ? void 0 : _ENEMY_STATS$e$kind.hp) || [58, 72, 88][level]) + level);
        Object.assign(enemies[enemies.length - 1], {
          group: e.group,
          bossType: e.bossType,
          spawnX: e.x
        });
      }
      total = enemies.length;
      $('#district').textContent = `0${n + 1} · ${levels[n].name}`;
      document.querySelectorAll('[data-level]').forEach((button, i) => {
        button.classList.toggle('selected', i === n);
        const icon = button.querySelector('i');
        if (icon) icon.textContent = i <= unlocked ? '↗' : '◇';
      });
    }
    function addEnemy(x, y, kind, hp) {
      const stats = ENEMY_STATS[kind];
      enemies.push({
        x,
        y,
        w: (stats === null || stats === void 0 ? void 0 : stats.w) || [104, 112, 125][level],
        h: (stats === null || stats === void 0 ? void 0 : stats.h) || [66, 78, 60][level],
        hp,
        maxHp: hp,
        kind,
        cool: 1.8 + rand(x),
        base: y,
        active: false,
        hurt: 0,
        age: 0,
        face: -1,
        guard: 0,
        burst: 0,
        phase: 1
      });
    }
    function overlay(title, body, button, kicker = 'NEON RAIN / FIELD TRANSMISSION') {
      $('#overlay').classList.remove('hidden');
      $('#overlay').classList.toggle('story', state === 'story');
      $('#overlay-title').textContent = title;
      $('#overlay-text').textContent = body;
      $('#start').innerHTML = `${button} <span>→</span>`;
      $('#overlay-kicker').textContent = kicker;
      $('#continue').style.display = 'none';
    }
    function chapter(n) {
      if (!artReady) return;
      reset(n);
      state = 'story';
      storyStep = 0;
      showStory();
      scrollToShell();
    }
    function showStory() {
      overlay(levels[level].name, levels[level].story[storyStep], storyStep === 2 ? '开始行动' : '继续对话', `${levels[level].speaker} · ${storyStep + 1} / 3`);
      $('#continue').style.display = 'block';
      $('#continue').textContent = '跳过剧情';
    }
    function play() {
      var _touchControls2;
      state = 'playing';
      keys.clear();
      (_touchControls2 = touchControls) === null || _touchControls2 === void 0 || _touchControls2.release();
      mouse.down = false;
      $('#overlay').classList.add('hidden');
      canvas.focus();
    }
    function retry() {
      score = checkpointScore;
      reset(level);
      play();
    }
    function pause() {
      var _touchControls3;
      soundscape.stop();
      (_touchControls3 = touchControls) === null || _touchControls3 === void 0 || _touchControls3.release();
      if (state === 'playing') {
        state = 'paused';
        mouse.down = false;
        keys.clear();
        overlay('雨中稍歇', '街区会等你。准备好了，就继续向前。', '继续行动');
      } else if (state === 'paused') play();
    }
    function burst(x, y, color, count = 10) {
      for (let i = 0; i < count; i++) {
        const life = .2 + Math.random() * .3;
        particles.push({
          x,
          y,
          vx: (Math.random() - .5) * 160,
          vy: (Math.random() - .7) * 160,
          life,
          maxLife: life,
          c: color,
          size: 1 + Math.random() * 2
        });
      }
      if (particles.length > 220) particles.splice(0, particles.length - 220);
    }
    function hitPlayer(damage) {
      if (player.inv > 0 || state !== 'playing') return;
      const absorbed = Math.min(player.shield, damage);
      player.shield -= absorbed;
      player.hp = Math.max(0, player.hp - (damage - absorbed));
      player.inv = .65;
      shake = 3.5;
      flash = .12;
      beep(90, .12);
      if (player.hp <= 0) {
        state = 'dead';
        mouse.down = false;
        overlay('信号中断', '电芯还在。深呼吸，再走一次这条街。', '重试本区域');
      }
    }
    function fire(angle) {
      const angles = player.weapon === 'spread' ? [-.17, 0, .17] : [0];
      const originY = player.y + (player.prone ? 7 : 15),
        reach = player.prone ? 31 : 24;
      for (const offset of angles) bullets.push({
        x: player.x + 10 + Math.cos(angle) * reach,
        y: originY + Math.sin(angle) * reach,
        vx: Math.cos(angle + offset) * 760,
        vy: Math.sin(angle + offset) * 760,
        life: 1.45,
        friendly: true
      });
      burst(player.x + 10 + Math.cos(angle) * (reach + 4), originY + Math.sin(angle) * (reach + 4), '#f4edbc', 3);
      beep(430, .045);
    }
    function update(dt) {
      var _waterAt;
      if (state !== 'playing') return;
      player.inv = Math.max(0, player.inv - dt);
      shot -= dt;
      player.power -= dt;
      player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      player.dropThrough = Math.max(0, player.dropThrough - dt);
      if (player.power <= 0) player.weapon = 'normal';
      const dx = (pressed('d') || pressed('arrowright') ? 1 : 0) - (pressed('a') || pressed('arrowleft') ? 1 : 0);
      let dy = (pressed('s') || pressed('arrowdown') ? 1 : 0) - (pressed('w') || pressed('arrowup') ? 1 : 0);
      const firingIntent = touch.firing || mouse.down || pressed('j');
      stepStreetDepth(player, dy, firingIntent, dt, G, level === 0, !!waterAt(player.x + 10, water));
      if (dx) player.face = dx;
      setProne(player, pressed('c'), obstacles);
      const jumpHeld = pressed(' ');
      if (jumpHeld && !input.jumpHeld) jumpBuffer = .14;
      input.jumpHeld = jumpHeld;
      jumpBuffer = Math.max(0, jumpBuffer - dt);
      player.coyote = player.ground ? .12 : Math.max(0, player.coyote - dt);
      const aimDy = dy;
      if (firingIntent) dy = 0;
      const ladder = !player.depth && !player.prone && ladders.find(l => Math.abs(player.x + 10 - l.x) < 25 && player.y + player.h >= l.y - 5 && player.y <= G - 38 && (player.y + player.h > l.y + 2 || dy > 0 || player.climbing));
      if (!firingIntent && ladder && dy !== 0) {
        player.climbing = true;
        player.vy = 0;
      }
      if (!ladder || dx !== 0) player.climbing = false;
      if (player.climbing && ladder) {
        player.x = approach(player.x, ladder.x - 10, 450 * dt);
        player.vx = 0;
        player.vy = dy * 160;
        player.ground = false;
        if (dy < 0 && player.y + 40 <= ladder.y + 5) {
          player.y = ladder.y - 40;
          player.vy = 0;
          player.ground = true;
          player.climbing = false;
        }
      } else {
        player.vx = approach(player.vx, dx * (player.prone ? 65 : player.inWater ? 130 : 225), (dx ? 2100 : 2600) * dt);
        player.vy += (player.inWater ? 470 : 900) * dt;
        if (player.inWater && dy < 0) {
          player.vy = approach(player.vy, -155, 1100 * dt);
          player.prone = false;
          player.h = 40;
        }
      }
      if (jumpBuffer > 0 && !player.prone && (player.coyote > 0 || player.climbing)) {
        if (dy > 0 && player.ground && player.y < G - 41) {
          player.dropThrough = .2;
          player.y += 4;
          player.vy = 40;
        } else {
          player.vy = -390;
          beep(200, .065);
        }
        player.ground = false;
        player.climbing = false;
        player.coyote = 0;
        jumpBuffer = 0;
      }
      if (!jumpHeld && player.vy < -175 && !player.climbing) player.vy = approach(player.vy, -175, 1500 * dt);
      if (pressed('shift') && !input.dash && !player.prone && player.dashCooldown <= 0) {
        player.dashTime = .14;
        player.dashCooldown = .85;
        player.inv = Math.max(player.inv, .16);
        player.climbing = false;
        beep(330, .08);
      }
      input.dash = pressed('shift');
      if (player.dashTime > 0) {
        player.dashTime -= dt;
        player.vx = player.face * 490;
        player.vy = 0;
      }
      const oldY = player.y,
        oldX = player.x;
      player.x = clamp(player.x + player.vx * dt, 0, LENGTH - 25);
      player.y += player.vy * dt;
      player.ground = false;
      const oldPool = waterAt(oldX + 10, water);
      if (oldPool && !waterAt(player.x + 10, water) && player.y + player.h > G + 3) player.x = oldX;
      const floor = ((_waterAt = waterAt(player.x + 10, water)) === null || _waterAt === void 0 ? void 0 : _waterAt.bottom) || G + (player.depth || 0);
      if (player.y + player.h >= floor) {
        player.y = floor - player.h;
        player.vy = 0;
        player.ground = true;
        player.climbing = false;
      }
      if (!player.climbing && player.vy >= 0 && player.dropThrough <= 0) {
        for (const platform of platforms) if (oldY + player.h <= platform.y + 2 && player.y + player.h >= platform.y && player.x + 20 > platform.x && player.x < platform.x + platform.w) {
          player.y = platform.y - player.h;
          player.vy = 0;
          player.ground = true;
        }
      }
      resolveObstacles(player, oldX, oldY, obstacles);
      player.y = Math.max(25, player.y);
      if (player.ground && !player.climbing && player.dashTime <= 0) player.anim += Math.abs(player.vx) * dt / RUN_STRIDE;
      if ((mouse.down || touch.firing || pressed('j')) && shot <= 0) {
        const angle = touch.firing ? touch.angle : mouse.down ? Math.atan2(mouse.y - player.y - (player.prone ? 7 : 15), mouse.x + camera - player.x - 10) : player.prone ? player.face > 0 ? 0 : Math.PI : Math.atan2(aimDy, dx || (!aimDy ? player.face : 0));
        if ((mouse.down || touch.firing) && Math.abs(Math.cos(angle)) > .01) player.face = Math.cos(angle) >= 0 ? 1 : -1;
        fire(angle);
        shot = player.weapon === 'rapid' ? .075 : .155;
      }
      const target = clamp(player.x - W * .36 + player.vx * .14, 0, LENGTH - W);
      camera += (target - camera) * (1 - Math.exp(-9 * dt));
      for (const zone of encounters) {
        if (!zone.cleared && player.x >= zone.trigger && (!activeEncounter || activeEncounter === zone)) {
          zone.active = true;
          activeEncounter = zone;
        }
        if (zone.active) {
          if (enemies.some(e => e.group === zone.group && e.hp > 0)) {
            player.x = clamp(player.x, zone.left, zone.right - 20);
          } else {
            zone.cleared = true;
            zone.active = false;
            activeEncounter = null;
            toast('封锁解除 · ' + zone.name);
            drops.push({
              x: zone.right - 70,
              y: G - 20,
              kind: 'heal',
              life: 45,
              vy: 0
            });
          }
        }
      }
      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        const ex = enemy.x,
          ey = enemy.y;
        stepEnemy(enemy, {
          player,
          bullets,
          time,
          ground: G,
          level
        }, dt);
        if (['street', 'sewer', 'shield', 'rusher', 'grenadier'].includes(enemy.kind)) {
          const body = _objectSpread(_objectSpread({}, enemy), {}, {
            vy: 0,
            vx: enemy.x - ex,
            ground: true
          });
          resolveObstacles(body, ex, ey, obstacles);
          enemy.x = body.x;
        }
        if (enemy.active && (enemy.kind !== 'sewer' || enemy.emerged) && player.x + 20 > enemy.x && player.x < enemy.x + enemy.w && player.y + player.h > enemy.y && player.y < enemy.y + enemy.h) hitPlayer(enemy.kind === 'rusher' ? 22 : 18);
      }
      for (const h of hazards) {
        const phase = (time + h.offset) % h.cycle;
        h.warning = h.alwaysOn || phase > h.cycle - 1.8;
        h.on = h.alwaysOn || phase > h.cycle - .85;
        if (h.on && player.x + 20 > h.x && player.x < h.x + h.w && player.y + player.h > G - (h.kind === 'electric' ? 14 : 55)) hitPlayer(20);
      }
      const beforeWaterHp = player.hp;
      stepWater(player, water, dt);
      if (player.hp > beforeWaterHp) toast(`恢复呼吸 +${player.hp - beforeWaterHp} HP`);
      if (player.hp <= 0 && state === 'playing') {
        state = 'dead';
        mouse.down = false;
        overlay('呼吸中断', '积水淹过了目镜。下次试试上方平台，或按 W 向水面游。', '重试本区域');
      }
      for (const blast of explosions) blast.life -= dt;
      explosions = explosions.filter(e => e.life > 0);
      for (const bullet of bullets) {
        if (bullet.gravity) bullet.vy += bullet.gravity * dt;
        bullet.x += bullet.vx * dt;
        bullet.y += bullet.vy * dt;
        bullet.life -= dt;
        if (bullet.grenade && (bullet.life <= 0 || bullet.y >= G - 5)) {
          const radius = bullet.radius || 55;
          explosions.push({
            x: bullet.x,
            y: Math.min(bullet.y, G - 12),
            r: radius,
            life: .3
          });
          if (Math.hypot(bullet.x - player.x - 10, Math.min(bullet.y, G - 12) - player.y - player.h / 2) < radius) hitPlayer(bullet.damage);
          bullet.life = 0;
          burst(bullet.x, Math.min(bullet.y, G - 12), '#ffb77f', 20);
          continue;
        }
        const cover = !bullet.grenade && !bullet.wave && obstacles.find(o => o.hp > 0 && pointInside(bullet.x, bullet.y, o));
        if (cover) {
          if (bullet.friendly) cover.hp--;
          bullet.life = 0;
          burst(bullet.x, bullet.y, '#dda379', 3);
          continue;
        }
        if (bullet.friendly) {
          for (const enemy of enemies) {
            if (enemy.kind === 'sewer' && !enemy.emerged && !(enemy.emerge > 0)) continue;
            if (enemy.hp <= 0 || bullet.x < enemy.x - 5 || bullet.x > enemy.x + enemy.w + 5 || bullet.y < enemy.y - 5 || bullet.y > enemy.y + enemy.h + 5) continue;
            bullet.life = 0;
            if (shieldBlocks(enemy, bullet)) {
              burst(bullet.x, bullet.y, '#81eaff', 3);
              break;
            }
            const damage = enemy.kind === 'boss' && enemy.bossType === 1 ? enemy.coreOpen ? 2 : .5 : 1;
            enemy.hp -= damage;
            enemy.hurt = .1;
            burst(bullet.x, bullet.y, '#ffc085', 4);
            if (enemy.hp <= 0) {
              killed++;
              score += enemy.kind === 'boss' ? 2000 : 100;
              burst(enemy.x, enemy.y + 15, '#ff749d', 18);
              drops.push({
                x: enemy.x + 8,
                y: enemy.y,
                kind: ['heal', 'spread', 'rapid', 'shield'][killed % 4],
                life: 30,
                vy: -90
              });
              beep(120, .11);
            }
            break;
          }
        } else if (!bullet.grenade && pointInside(bullet.x, bullet.y, playerHitbox(player))) {
          hitPlayer(bullet.damage || 14);
          bullet.life = 0;
        }
      }
      bullets = bullets.filter(b => b.life > 0 && b.y > 0 && b.y < H);
      for (const drop of drops) {
        drop.life -= dt;
        drop.vy += 440 * dt;
        const old = drop.y;
        drop.y = Math.min(G - 19, drop.y + drop.vy * dt);
        for (const p of platforms) if (drop.vy >= 0 && old + 18 <= p.y + 2 && drop.y + 18 >= p.y && drop.x >= p.x && drop.x <= p.x + p.w) {
          drop.y = p.y - 18;
          drop.vy = 0;
        }
        const distance = Math.hypot(drop.x - player.x - 10, drop.y - player.y - player.h / 2);
        if (distance < 85) {
          drop.x += (player.x + 10 - drop.x) * dt * 7;
          drop.y += (player.y + player.h / 2 - drop.y) * dt * 7;
        }
        if (distance < 35) {
          if (drop.kind === 'heal') player.hp = Math.min(100, player.hp + 30);
          if (drop.kind === 'shield') player.shield = 40;
          if (['spread', 'rapid'].includes(drop.kind)) {
            player.weapon = drop.kind;
            player.power = 18;
          }
          drop.life = 0;
          toast({
            heal: '医疗包 +30 HP',
            shield: '护盾已激活',
            spread: '散射模块 · 18 秒',
            rapid: '速射模块 · 18 秒'
          }[drop.kind]);
          beep(660, .1);
        }
      }
      drops = drops.filter(d => d.life > 0);
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 180 * dt;
        p.life -= dt;
      }
      particles = particles.filter(p => p.life > 0);
      if (state === 'playing' && player.x > LENGTH - 100 && enemies[enemies.length - 1].hp <= 0) {
        state = 'complete';
        mouse.down = false;
        unlocked = Math.max(unlocked, Math.min(2, level + 1));
        save(true);
        overlay(level === 2 ? '万家灯火' : '区域突破', level === 2 ? '电流重新流过街区。面馆的招牌亮起，窗边有人向你挥手。耳机里传来老陈的声音：「汤还热着，回来吧。」' : '「收到了，你的信号很清楚。」老陈的声音再次响起。城市的另一侧，还有人在等你。', level === 2 ? '重返夜市' : '进入下一区域');
      }
    }
    let last = performance.now(),
      accumulator = 0,
      lastStatus = '';
    function loop(now) {
      var _touchControls4, _touchControls5;
      (_touchControls4 = touchControls) === null || _touchControls4 === void 0 || _touchControls4.sync(state);
      const elapsed = Math.min(.05, (now - last) / 1000);
      last = now;
      if (state === 'playing') {
        accumulator += elapsed;
        while (accumulator >= STEP) {
          time += STEP;
          update(STEP);
          accumulator -= STEP;
        }
      } else {
        accumulator = 0;
        if (state !== 'paused') time += elapsed;
      }
      soundscape.update(elapsed, {
        state,
        player,
        enemies,
        level
      });
      shake = Math.max(0, shake - elapsed * 20);
      flash = Math.max(0, flash - elapsed);
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
      render(ctx, {
        level,
        camera,
        time,
        state,
        player,
        enemies,
        bullets,
        particles,
        drops,
        platforms,
        ladders,
        obstacles,
        hazards,
        water,
        explosions,
        activeEncounter,
        score,
        killed,
        total,
        length: LENGTH,
        mouse,
        flash,
        touchMode: (_touchControls5 = touchControls) === null || _touchControls5 === void 0 ? void 0 : _touchControls5.enabled
      });
      ctx.restore();
      if (lastStatus !== state) {
        lastStatus = state;
        $('#status').textContent = state === 'playing' ? 'LOCAL SESSION / IN ACTION' : state === 'paused' ? 'LOCAL SESSION / PAUSED' : 'LOCAL SESSION / READY';
      }
      requestAnimationFrame(loop);
    }
    function loseFocus() {
      var _touchControls6;
      soundscape.stop();
      (_touchControls6 = touchControls) === null || _touchControls6 === void 0 || _touchControls6.release();
      keys.clear();
      mouse.down = false;
      input.jumpHeld = false;
      if (state === 'playing') pause();
    }
    addEventListener('keydown', event => {
      if (event.target.matches('textarea,input') || $('#guide').open) return;
      const key = event.key.toLowerCase();
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
      keys.add(key);
      if (key === 'escape' && !event.repeat) pause();
      if (key === 'r' && state === 'dead') retry();
    });
    addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
    addEventListener('blur', loseFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) loseFocus();
    });
    function pointer(event) {
      if (event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - bounds.left) * W / bounds.width;
      mouse.y = (event.clientY - bounds.top) * H / bounds.height;
      mouse.active = true;
    }
    canvas.addEventListener('pointermove', pointer);
    canvas.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' && event.button === 0 && state === 'playing') {
        pointer(event);
        mouse.down = true;
        canvas.focus();
      }
    });
    addEventListener('pointerup', () => mouse.down = false);
    addEventListener('pointercancel', () => mouse.down = false);
    canvas.addEventListener('contextmenu', event => event.preventDefault());
    $('#start').onclick = () => {
      if (state === 'menu') chapter(0);else if (state === 'story') {
        if (++storyStep < 3) showStory();else play();
      } else if (state === 'paused') play();else if (state === 'dead') retry();else if (state === 'complete') chapter(level === 2 ? 0 : level + 1);
    };
    $('#continue').onclick = () => {
      if (state === 'story') {
        play();
        return;
      }
      const saved = load();
      if (saved) {
        unlocked = saved.unlocked;
        score = saved.score;
        chapter(saved.level);
      } else toast('暂无存档，开始新的旅程吧');
    };
    $('#save').onclick = () => {
      if (state === 'menu' || state === 'loading') {
        toast('进入街区后可保存进度');
        return;
      }
      save();
    };
    $('#sound').onclick = () => {
      muted = !muted;
      soundscape.setEnabled(!muted);
      $('#sound').textContent = `声音 ${muted ? 'OFF' : 'ON'}`;
      beep(500);
    };
    $('#help').onclick = () => {
      if (state === 'playing') pause();
      $('#guide').showModal();
    };
    $('#close-guide').onclick = () => $('#guide').close();
    $('#share').onclick = async () => {
      const value = state === 'menu' || state === 'loading' ? load() || {
        version: 1,
        level: 0,
        unlocked: 0,
        score: 0
      } : save(true);
      var code = encodeSave(value);
      $('#code').value = code;
      $('#guide').showModal();
      toast('存档码已生成 · 长按选中复制');
    };
    function importCode(input) {
      try {
        const code = input.includes('#save=') ? input.split('#save=')[1] : input;
        const saved = decodeSave(decodeURIComponent(code.trim()));
        unlocked = saved.unlocked;
        score = saved.score;
        chapter(saved.level);
        save(true);
        toast('存档导入成功');
        return true;
      } catch (_unused7) {
        toast('存档格式无效或版本不兼容');
        return false;
      }
    }
    $('#import').onclick = () => {
      if (artReady && importCode($('#code').value)) $('#guide').close();
    };
    document.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
      const n = Number(button.dataset.level);
      if (!artReady) return;
      if (n <= unlocked) chapter(n);else toast('先完成上一章节，解锁这片街区');
    });
    touchControls = mountTouch({
      touch,
      getState: () => state,
      getFace: () => {
        var _player;
        return ((_player = player) === null || _player === void 0 ? void 0 : _player.face) || 1;
      },
      pause
    });
    reset(0);
    $('#start').disabled = true;
    $('#start').textContent = '正在载入美术…';
    hydrateThenArt(progress => {
      $('#start').textContent = `载入街区 ${Math.round(progress * 100)}%`;
    }).then(() => {
      artReady = true;
      state = 'menu';
      $('#start').disabled = false;
      $('#start').innerHTML = '进入街区 <span>→</span>';
      const saved = load();
      if (saved) {
        unlocked = saved.unlocked;
        score = saved.score;
        reset(0);
      }
      if (location.hash.startsWith('#save=')) importCode(location.hash);
    }).catch(error => {
      state = 'error';
      $('#start').textContent = '载入失败，请刷新';
      toast(error.message);
    });
    requestAnimationFrame(loop);
    window.neonRain = {
      getState: () => ({
        state,
        level,
        unlocked,
        score,
        player: _objectSpread({}, player),
        enemies: enemies.filter(e => e.hp > 0).length,
        platforms: platforms.length,
        ladders: ladders.length,
        artReady
      })
    };
    addEventListener("pagehide", loseFocus);
    document.querySelectorAll("[data-minitool-level]").forEach(button => button.onclick = () => {
      const n = Number(button.dataset.minitoolLevel);
      if (!artReady) return;
      if (n <= unlocked) {
        $("#mobile-options").close();
        chapter(n);
      } else toast("需先通关上一关");
    });
    $('#minitool-retry').onclick = () => {
      if (artReady) {
        $('#mobile-options').close();
        retry();
      }
    };
    return {};
  }();
})();