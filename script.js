(function() {
  let currentPath = window.location.pathname.split('/').pop();
  if (currentPath === '' || currentPath === '/' || !currentPath.endsWith('.html')) {
    currentPath = 'index.html';
  }

  // ========== СОЗДАНИЕ НАДПИСЕЙ LOVE НА ФОНЕ ==========
  function createLoveBackground() {
    const oldLayer = document.querySelector('.love-text-bg');
    if (oldLayer) oldLayer.remove();
    
    const loveLayer = document.createElement('div');
    loveLayer.className = 'love-text-bg';
    
    const words = ['Love', 'Love', 'Love', 'Love', '❤', 'Love', 'Love', '💕', 'Love', 'Love', '💗', 'Love', 'Love', '💖', 'Love'];
    
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 10; col++) {
        const word = document.createElement('span');
        word.className = 'love-word';
        word.textContent = words[(row + col) % words.length];
        word.style.left = (col * 10 + (Math.random() * 3 - 1.5)) + '%';
        word.style.top = (row * 6.7 + (Math.random() * 2 - 1)) + '%';
        word.style.setProperty('--rot', (Math.random() * 24 - 12) + 'deg');
        word.style.fontSize = (Math.random() * 0.4 + 0.7) + 'rem';
        word.style.opacity = (Math.random() * 0.25 + 0.12);
        loveLayer.appendChild(word);
      }
    }
    
    document.body.appendChild(loveLayer);
  }
  
  createLoveBackground();

  // ========== МУЗЫКА: ОДНА ПЕСНЯ, БЕЗ ПРЕРЫВАНИЯ ПРИ ПЕРЕКЛЮЧЕНИИ ==========
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;
  let musicPlaying = false;

  function updateIcon() {
    if (musicIcon) musicIcon.textContent = musicPlaying ? '🔊' : '🔇';
  }

  // Сохранение состояния
  function saveMusicState() {
    if (bgMusic) {
      localStorage.setItem('musicPlaying', musicPlaying ? 'true' : 'false');
      localStorage.setItem('musicCurrentTime', bgMusic.currentTime);
      localStorage.setItem('musicVolume', bgMusic.volume);
    }
  }

  // Восстановление состояния при загрузке страницы
  function restoreMusicState() {
    if (!bgMusic) return;
    
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicCurrentTime')) || 0;
    const savedVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.4;
    
    bgMusic.volume = savedVolume;
    bgMusic.currentTime = savedTime;
    
    if (wasPlaying) {
      // Пытаемся продолжить воспроизведение
      bgMusic.play().then(() => {
        musicPlaying = true;
        updateIcon();
        // Запускаем периодическое сохранение
        startSaving();
      }).catch(() => {
        // Автовоспроизведение заблокировано – ждём клика
        musicPlaying = false;
        updateIcon();
        // Устанавливаем однократный обработчик клика для запуска
        document.addEventListener('click', function resumeOnClick() {
          if (!musicPlaying) {
            bgMusic.play().then(() => {
              musicPlaying = true;
              updateIcon();
              startSaving();
            }).catch(() => {});
          }
          document.removeEventListener('click', resumeOnClick);
        }, { once: false });
      });
    } else {
      musicPlaying = false;
      updateIcon();
    }
  }

  let saveInterval = null;
  function startSaving() {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveMusicState, 1000);
  }

  if (bgMusic && musicToggle) {
    // Начальная установка громкости
    bgMusic.volume = parseFloat(localStorage.getItem('musicVolume')) || 0.4;
    
    // Пытаемся восстановить состояние (если музыка уже играла на предыдущей странице)
    restoreMusicState();

    // Запуск по клику в любом месте, если ещё не играет
    document.addEventListener('click', function startOnClick() {
      if (!musicPlaying && bgMusic.paused) {
        bgMusic.play().then(() => {
          musicPlaying = true;
          updateIcon();
          saveMusicState();
          startSaving();
        }).catch(() => {});
      }
      // Не удаляем обработчик, он просто не будет выполнять лишних действий
    });

    // Кнопка mute/unmute
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        updateIcon();
        saveMusicState();
        if (saveInterval) {
          clearInterval(saveInterval);
          saveInterval = null;
        }
      } else {
        bgMusic.play().then(() => {
          musicPlaying = true;
          updateIcon();
          saveMusicState();
          startSaving();
        }).catch(() => {
          musicPlaying = false;
          updateIcon();
        });
      }
    });

    // Сохраняем состояние перед уходом со страницы
    window.addEventListener('beforeunload', saveMusicState);
  }

  // ========== ФОН ШАПКИ ==========
  const headerInner = document.querySelector('.header-inner');
  if (headerInner) {
    const customBg = headerInner.getAttribute('data-header-bg');
    const defaultBg = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1400&h=600&fit=crop';
    headerInner.style.backgroundImage = `url('${customBg || defaultBg}')`;
  }

  // ========== ГЛАВНАЯ СТРАНИЦА ==========
  const mainPageData = {
    photos: [
      { src: 'img/111.webp', compliment: 'твой взгляд — мой дом', reflection: 'Я помню тот день, когда впервые увидел тебя. Ты посмотрела на меня своими невероятными глазами, и весь мир вокруг просто перестал существовать. Всё, что имело значение до этого момента, вдруг стало таким неважным. Осталась только ты — самая прекрасная, самая удивительная, самая родная.', position: 'center' },
      { src: 'img/222.jpg', compliment: 'твоя грация', reflection: 'В каждом твоём движении — целая симфония. Ты даже просто стоишь на месте, а я уже слышу самую красивую мелодию в своей жизни. Твоя грация завораживает меня каждый раз, когда я смотрю на тебя.', position: 'left' },
      { src: 'img/333.jpg', compliment: 'твоя загадка', reflection: 'Ты — самая интересная книга, которую мне когда-либо доводилось читать. Каждый день я открываю в тебе что-то новое и невероятно прекрасное. Твоя душа — это бесконечный океан.', position: 'right' },
      { src: 'img/444.jpg', compliment: 'улыбка, которая лечит', reflection: 'Твоя улыбка — это самое мощное лекарство, которое я когда-либо знал. Когда ты улыбаешься, все мои тревоги и печали просто исчезают, растворяясь в твоём свете.', position: 'center' },
      { src: 'img/555.jpg', compliment: 'твой стиль', reflection: 'Твой образ — это настоящее произведение искусства, достойное лучших галерей мира. Ты сочетаешь в себе столько прекрасных качеств, что я иногда не могу поверить.', position: 'left' },
      { src: 'img/666.WEBP', compliment: 'твоя душа', reflection: 'За твоей невероятной внешней красотой скрывается ещё более прекрасная душа. Твоя доброта, твоя искренность — всё это делает тебя по-настоящему особенной.', position: 'right' },
      { src: 'img/777.WEBP', compliment: 'тишина, полная смысла', reflection: 'С тобой даже самое обычное молчание становится невероятно уютным. Мы можем просто сидеть рядом, ничего не говоря, и я чувствую себя абсолютно счастливым.', position: 'center' }
    ]
  };

  // ========== СТРАНИЦА 1 - МИЛАЯ (15 фото) ==========
  const page1Data = {
    photos: [
      { src: 'img/1111.jpg', compliment: 'ты невероятно милая', reflection: 'Твоя милота — это то, что заставляет моё сердце биться чаще каждый раз, когда я вижу тебя. Ты самая добрая, самая нежная, самая заботливая душа, которую я когда-либо встречал.', size: 'small', rot: '-2' },
      { src: 'img/22221.jpg', compliment: 'твоя доброта светится ярче солнца', reflection: 'Когда ты улыбаешься своей невероятно милой улыбкой, весь мир вокруг меня просто преображается. Серые будни становятся яркими, а на душе становится так тепло.', size: 'medium', rot: '1' },
      { src: 'img/3333.webp', compliment: 'ты как тёплый лучик света', reflection: 'Твоя нежность — это то, что я ценю в тебе больше всего на свете. Ты умеешь быть такой мягкой и ласковой, что всё моё существо наполняется покоем.', size: 'large', rot: '-3' },
      { src: 'img/444400.jpg', compliment: 'нежность в каждой твоей улыбке', reflection: 'Ты делаешь каждый мой день особенным просто тем, что существуешь. Твоё присутствие в моей жизни — это самый большой подарок судьбы.', size: 'medium', rot: '2' },
      { src: 'img/5555.jpg', compliment: 'твой взгляд согревает мою душу', reflection: 'Когда ты смотришь на меня своими прекрасными глазами, я чувствую себя самым счастливым человеком на свете. Твой взгляд способен растопить любое сердце.', size: 'small', rot: '-1' },
      { src: 'img/666600.jpg', compliment: 'ты — само очарование и прелесть', reflection: 'Ты даже не представляешь, насколько ты очаровательна. Каждый твой жест, каждое твоё слово наполнены невероятной прелестью и шармом.', size: 'large', rot: '4' },
      { src: 'img/7777.png', compliment: 'милее тебя нет никого на свете', reflection: 'Я пересмотрел весь мир, но так и не нашёл никого, кто мог бы сравниться с тобой по милоте и очарованию. Ты уникальна в своей доброте.', size: 'medium', rot: '-2' },
      { src: 'img/8888.jpg', compliment: 'твоя забота делает меня счастливым', reflection: 'Твоя забота — это то, что согревает меня в самые холодные дни. Ты умеешь делать мою жизнь лучше просто своим присутствием.', size: 'small', rot: '3' },
      { src: 'img/9999.jpg', compliment: 'ты делаешь этот мир намного добрее', reflection: 'Мир становится лучше каждый раз, когда ты входишь в комнату. Твоя энергетика и доброта распространяются на всех вокруг.', size: 'large', rot: '-4' },
      { src: 'img/0000.jpg', compliment: 'твои глаза сияют как две звезды', reflection: 'В твоих глазах я вижу целую вселенную, полную любви и нежности. Они сияют ярче любого созвездия на ночном небе.', size: 'medium', rot: '1' },
      { src: 'img/11110.jpg', compliment: 'ты — воплощение чистой нежности', reflection: 'Ты — само определение слова "нежность". Всё в тебе дышит мягкостью и лаской, и я бесконечно благодарен за это.', size: 'small', rot: '-1' },
      { src: 'img/22220.jpg', compliment: 'с тобой рядом так тепло и спокойно', reflection: 'Рядом с тобой я чувствую себя как дома. Ты даришь мне чувство покоя и уюта, которое я не испытывал никогда раньше.', size: 'medium', rot: '2' },
      { src: 'img/33330.jpg', compliment: 'ты словно пушистый котёнок', reflection: 'Твоя ласковость и игривость напоминают мне маленького котёнка. Ты такая же тёплая и родная, что хочется обнимать тебя вечно.', size: 'large', rot: '-3' },
      { src: 'img/44440.jpg', compliment: 'твоя душа прекрасна и чиста', reflection: 'Твоя душа — это самый чистый источник, из которого я готов пить бесконечно. В ней нет ни капли зла или зависти.', size: 'small', rot: '4' },
      { src: 'img/55550.jpg', compliment: 'ты — моя самая милая девочка', reflection: 'Для меня ты всегда будешь самой милой, самой родной и самой любимой. Никто и никогда не сможет занять твоё место в моём сердце.', size: 'medium', rot: '-1' }
    ]
  };

  // ========== СТРАНИЦА 2 - КРАСИВАЯ (15 фото) ==========
  const page2Data = {
    photos: [
      { src: 'img/1.jpg', compliment: 'ты ослепительно красива', reflection: 'Твоя красота — это не просто внешность. Это особый внутренний свет, который исходит из самой глубины твоей души и озаряет всё вокруг.', size: 'medium', rot: '2' },
      { src: 'img/7.png', compliment: 'твоя красота уникальна', reflection: 'Ты прекрасна в своей естественности и натуральности. Без макияжа, с распущенными волосами — ты всё равно самая красивая.', size: 'large', rot: '-2' },
      { src: 'img/3.jpg', compliment: 'ты сияешь ярче любой звезды', reflection: 'Каждый раз, глядя на тебя, я поражаюсь тому, насколько ты красива. Твоя внутренняя красота — вот что по-настоящему захватывает дух.', size: 'small', rot: '3' },
      { src: 'img/4.jpg', compliment: 'ты прекрасна в каждом мгновении', reflection: 'Ты сама того не замечая, делаешь мир вокруг себя прекраснее просто своим присутствием. Твоя красота наполняет всё вокруг.', size: 'medium', rot: '-1' },
      { src: 'img/6.jpg', compliment: 'твой образ — это высокое искусство', reflection: 'Ты как произведение искусства, которым можно любоваться бесконечно. Каждая твоя черта совершенна и неповторима.', size: 'large', rot: '1' },
      { src: 'img/5.jpg', compliment: 'ты красивее всех цветов в мире', reflection: 'Самые прекрасные цветы меркнут по сравнению с твоей красотой. Ты — настоящий бриллиант в этом мире.', size: 'small', rot: '-4' },
      { src: 'img/2.jpg', compliment: 'твоя улыбка — это солнечный свет', reflection: 'Когда ты улыбаешься, кажется что выглядывает солнце из-за туч. Твоя улыбка способна осветить даже самый тёмный день.', size: 'medium', rot: '2' },
      { src: 'img/8.jpg', compliment: 'ты прекрасна и внутри и снаружи', reflection: 'Твоя внешняя красота — лишь отражение твоей прекрасной души. Ты красива абсолютно во всех смыслах этого слова.', size: 'large', rot: '-3' },
      { src: 'img/9.jpg', compliment: 'твои черты лица совершенны', reflection: 'Я могу смотреть на тебя часами и каждый раз находить что-то новое и прекрасное. Твоё лицо — это картина великого художника.', size: 'small', rot: '4' },
      { src: 'img/0.jpg', compliment: 'ты как произведение искусства', reflection: 'Ты достойна того, чтобы тебя рисовали лучшие художники мира. Твоя красота вдохновляет и заставляет сердце биться чаще.', size: 'medium', rot: '-2' },
      { src: 'img/09.jpg', compliment: 'красота твоей души поражает', reflection: 'Твоя душа настолько прекрасна, что внешняя красота кажется лишь приятным дополнением. Ты удивительный человек.', size: 'large', rot: '1' },
      { src: 'img/05.jpg', compliment: 'ты затмеваешь всех своей красотой', reflection: 'Когда ты входишь в комнату, все взгляды обращаются к тебе. Ты затмеваешь всех своей невероятной красотой.', size: 'small', rot: '-1' },
      { src: 'img/08.jpg', compliment: 'твой стиль всегда безупречен', reflection: 'У тебя потрясающее чувство стиля. Ты умеешь выглядеть великолепно в любой одежде и в любой ситуации.', size: 'medium', rot: '3' },
      { src: 'img/07.jpg', compliment: 'ты — моя самая красивая', reflection: 'Для меня ты всегда была и будешь самой красивой женщиной на свете. Никто не сравнится с тобой.', size: 'large', rot: '-4' },
      { src: 'img/06.jpg', compliment: 'ты прекрасна даже без макияжа', reflection: 'Твоя природная красота не нуждается в украшениях. Ты прекрасна именно такая, какая ты есть — настоящая и искренняя.', size: 'small', rot: '2' }
    ]
  };

  // ========== СТРАНИЦА 3 - СМЕШНАЯ (15 фото) ==========
  const page3Data = {
    photos: [
      { src: 'img/11.jpg', compliment: 'твой смех заразителен', reflection: 'Твой смех — это самая прекрасная мелодия, которую я когда-либо слышал. Он искренний, заразительный, чистый и такой родной.', size: 'large', rot: '-2' },
      { src: 'img/22.jpg', compliment: 'ты умеешь поднять настроение', reflection: 'С тобой никогда не бывает скучно. Ты умеешь превратить самый обычный день в настоящее захватывающее приключение.', size: 'small', rot: '3' },
      { src: 'img/33.jpg', compliment: 'с тобой всегда невероятно весело', reflection: 'Твоё потрясающее чувство юмора — это один из тех даров, которые делают тебя такой особенной.', size: 'medium', rot: '-1' },
      { src: 'img/44.jpg', compliment: 'твои шутки — лучшее лекарство', reflection: 'Когда мне грустно, только ты можешь рассмешить меня. Твои шутки — это самое эффективное лекарство от любой печали.', size: 'large', rot: '2' },
      { src: 'img/55.jpg', compliment: 'ты самая смешная и остроумная', reflection: 'Твой острый ум и потрясающее чувство юмора делают тебя самой интересной собеседницей в моей жизни.', size: 'small', rot: '-4' },
      { src: 'img/66.jpg', compliment: 'твой юмор уникален и неповторим', reflection: 'Никто не умеет шутить так как ты. Твой юмор — это что-то совершенно особенное и неповторимое.', size: 'medium', rot: '1' },
      { src: 'img/77.jpg', compliment: 'ты заставляешь меня улыбаться', reflection: 'Даже в самый хмурый день ты можешь вызвать у меня улыбку. Твоя способность поднимать настроение — это настоящий дар.', size: 'large', rot: '-3' },
      { src: 'img/88.jpg', compliment: 'твои истории — это чистый огонь', reflection: 'Я готов слушать твои истории бесконечно. Ты рассказываешь их так увлекательно и смешно, что невозможно оторваться.', size: 'small', rot: '4' },
      { src: 'img/99.jpg', compliment: 'с тобой невозможно соскучиться', reflection: 'Ты — настоящий генератор веселья. С тобой каждый день становится праздником, полным смеха и радости.', size: 'medium', rot: '-2' },
      { src: 'img/1212.jpg', compliment: 'ты — настоящая королева приколов', reflection: 'В мире смеха и веселья ты занимаешь королевский трон. Ты самая смешная из всех кого я знаю.', size: 'large', rot: '1' },
      { src: 'img/1010.jpg', compliment: 'твой смех звучит как музыка', reflection: 'Когда ты смеёшься, я забываю обо всём на свете. Твой смех — это самая красивая симфония для моих ушей.', size: 'small', rot: '-1' },
      { src: 'img/1313.jpg', compliment: 'ты знаешь как рассмешить меня', reflection: 'У тебя есть особый талант — ты знаешь как рассмешить меня в любой, даже самой грустной ситуации.', size: 'medium', rot: '3' },
      { src: 'img/1414.jpg', compliment: 'твоя улыбка лечит мою душу', reflection: 'Твоя улыбка — это бальзам для моей души. Она залечивает любые раны и дарит надежду на лучшее.', size: 'large', rot: '-4' },
      { src: 'img/1515.jpg', compliment: 'ты — моя самая весёлая', reflection: 'С тобой моя жизнь наполнилась смехом и радостью. Ты самая весёлая и жизнерадостная из всех.', size: 'small', rot: '2' },
      { src: 'img/1616.jpg', compliment: 'с тобой мир становится ярче', reflection: 'Ты делаешь мир вокруг себя ярче и радостнее. Спасибо тебе за то, что ты есть и за то, что ты такая.', size: 'medium', rot: '-1' }
    ]
  };

  // ========== СТРАНИЦА 4 - НЕПОВТОРИМАЯ ==========
  const page4Data = {
    photos: [
      { src: 'img/11111.jpg', compliment: 'ты единственная такая', reflection: 'Ты абсолютно неповторима и уникальна.', size: 'small', rot: '3' },
      { src: 'img/22222.jpg', compliment: 'ты неповторима ни в чём', reflection: 'Твоя уникальность привлекла меня с первой минуты.', size: 'medium', rot: '-2' },
      { src: 'img/33333.jpg', compliment: 'такой как ты больше нет', reflection: 'Я ценю каждую твою особенность.', size: 'large', rot: '1' },
      { src: 'img/44444.jpg', compliment: 'ты — уникальная вселенная', reflection: 'Ты — целая вселенная, полная загадок.', size: 'small', rot: '-4' },
      { src: 'img/55555.jpg', compliment: 'твоя индивидуальность', reflection: 'Твоя индивидуальность проявляется во всём.', size: 'medium', rot: '2' },
      { src: 'img/66666.jpg', compliment: 'ты особенная во всём', reflection: 'В тебе нет ничего обычного или заурядного.', size: 'large', rot: '-3' },
      { src: 'img/77777.jpg', compliment: 'ты не похожа ни на кого', reflection: 'Ты — единственная в своём роде.', size: 'small', rot: '4' },
      { src: 'img/99999.jpg', compliment: 'твоя душа — бриллиант', reflection: 'Твоя душа — драгоценный камень.', size: 'medium', rot: '-1' },
      { src: 'img/88888.jpg', compliment: 'ты — редчайшее сокровище', reflection: 'Найти такого человека — невероятная удача.', size: 'large', rot: '2' },
      { src: 'img/00000.jpg', compliment: 'ты неповторима как снежинка', reflection: 'Нет двух одинаковых людей как ты.', size: 'small', rot: '-2' },
      { src: 'img/000001.jpg', compliment: 'твой характер — золото', reflection: 'Твой характер благороден как золото.', size: 'medium', rot: '1' },
      { src: 'img/000002.jpg', compliment: 'ты — моя неповторимая', reflection: 'Такой как ты больше нет во вселенной.', size: 'large', rot: '-4' },
      { src: 'img/000003.jpg', compliment: 'ты самая особенная', reflection: 'Ты заняла место в моём сердце навсегда.', size: 'small', rot: '3' },
      { src: 'img/000004.jpg', compliment: 'твоя сущность уникальна', reflection: 'Я люблю каждую частичку тебя.', size: 'medium', rot: '-3' },
      { src: 'img/000005.jpg', compliment: 'ты одна такая на вселенную', reflection: 'Ты — единственная и самая любимая.', size: 'large', rot: '1' }
    ]
  };

  // ========== РЕНДЕР ГЛАВНОЙ ==========
  if (currentPath === 'index.html') {
    const feed = document.getElementById('photoFeed');
    if (feed) {
      feed.innerHTML = '';
      const d = mainPageData; let i = 0;
      while (i < d.photos.length) {
        const row = document.createElement('div'); row.className = 'photo-row';
        const a = d.photos[i], b = d.photos[i+1], c = d.photos[i+2];
        if (a.position==='left' && b?.position==='center' && c?.position==='right') {
          row.appendChild(card(a,'side-card left-card')); row.appendChild(card(b,'center-card')); row.appendChild(card(c,'side-card right-card'));
          feed.appendChild(row); i+=3;
        } else if (a.position==='center' && b?.position==='right') {
          row.appendChild(card(a,'center-card')); row.appendChild(card(b,'side-card right-card'));
          const ph=document.createElement('div'); ph.className='side-card placeholder'; row.appendChild(ph);
          feed.appendChild(row); i+=2;
        } else if (a.position==='left' && b?.position==='center') {
          row.appendChild(card(a,'side-card left-card')); row.appendChild(card(b,'center-card'));
          const ph=document.createElement('div'); ph.className='side-card placeholder'; row.appendChild(ph);
          feed.appendChild(row); i+=2;
        } else { feed.appendChild(card(a,'center-card single-card')); i+=1; }
      }
      observe('.memory-card','visible');
    }
  }

  // ========== РЕНДЕР ДОПОЛНИТЕЛЬНЫХ СТРАНИЦ ==========
  const scrollPages = {
    '1.html': page1Data,
    '2.html': page2Data,
    '3.html': page3Data,
    '4.html': page4Data
  };

  if (currentPath !== 'index.html' && scrollPages[currentPath]) {
    const gal = document.getElementById('scrollGallery');
    if (gal) {
      gal.innerHTML = '';
      scrollPages[currentPath].photos.forEach(p => {
        const item = document.createElement('div'); item.className = 'scroll-item';
        item.innerHTML = `<div class="scroll-photo-wrapper size-${p.size || 'medium'}"><div class="polaroid-frame" style="--rot:${p.rot || '0'}deg;"><img src="${p.src}" alt="момент" loading="lazy"><div class="hover-compliment">${p.compliment}</div></div></div><div class="scroll-text-wrapper"><p class="typing-text" data-text="${p.reflection.replace(/"/g,'&quot;')}"></p></div>`;
        gal.appendChild(item);
      });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            const tel = e.target.querySelector('.typing-text');
            if (tel && !tel.classList.contains('started')) {
              tel.classList.add('started');
              typeText(tel, tel.getAttribute('data-text'), 15);
            }
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      document.querySelectorAll('.scroll-item').forEach(el => obs.observe(el));
    }
  }

  function typeText(el, text, spd) {
    el.textContent = ''; let idx = 0;
    function add() { if (idx < text.length) { el.textContent += text.charAt(idx); idx++; setTimeout(add, spd); } else { el.classList.add('done'); } }
    add();
  }

  function card(item, cls) {
    const c = document.createElement('div'); c.className = `memory-card ${cls}`;
    c.innerHTML = `<div class="polaroid-frame"><img src="${item.src}" alt="момент" loading="lazy"><div class="hover-compliment">${item.compliment}</div></div><p class="reflection-text">${item.reflection}</p>`;
    return c;
  }

  function observe(sel, cls) {
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(cls); }); }, { threshold: 0.25 });
    document.querySelectorAll(sel).forEach(el => obs.observe(el));
  }

  // Партиклы
  function createPetal() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    const petal = document.createElement('div'); petal.className = 'petal';
    const size = Math.random() * 12 + 6;
    petal.style.width = size + 'px'; petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = Math.random() * 10 + 8 + 's';
    container.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
  setInterval(createPetal, 700);
  for (let i = 0; i < 10; i++) setTimeout(createPetal, i * 250);
})();