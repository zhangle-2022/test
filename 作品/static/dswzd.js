$(function () {
  var $content_boxs = $(".content_box");
  window.root = {
    totalScore: 0,
    time: 0
  };
  var previousQuestionTime = 0; // 上一题结束时间 
  // costTime 单题花费时间，点击下一题到该题点击下一题所耗费的秒数
  // date 期数：eg: 202110
  // ip \ ipAddr   IP归属地
  // seq 当前题目序列号，0、1-10
  // started 是否为某一题开始，0是则为开始，1为结束(确定按钮为1，下一题按钮为0)
  // totalTime 总花费时间，从计时开始到目前的总时间秒数
  // 初始数据
  const data = {seq:1,costTime:0,date:202303,started:0,totalTime:root.time};
  const url = '/gov-statistics/statistics/newSubmit';
  var eventnum, arr_title;
  var title = $(document).attr("title");
  if (title != '') {
    arr_title = title.split('_');
    eventnum = arr_title[0].replace('国务院大事我知道', '');
  }
  init();
  function init(){
    layout();
    setTimer();
    bindEvent();
    count();
  }
  function bindEvent(){
    select();
    submitQuestion();
    completion();
    submitCompletion();
    getScore();
    onceMore();
    nextQuestion();
  }
  // 重新答题
  function onceMore() {
    $('#again').on('click', function () {
      location.reload();
      window.scrollTo(0,0);
    })
  }

  //向云分析推送结果
  function mTrackData(p, xvalue) {
    //console.log("国务院大事我知道" + eventnum, eventnum + "问题" + p, { '选项': xvalue })
     _trackData.push(['addaction', "国务院大事我知道" + eventnum, eventnum + "问题" + p, { '选项': xvalue }]);
    //console.log(_trackData);
  }

  // 查看结果
  function getScore(){
    $('.getScore-butn').on('click', function(){
      if(root.totalScore>100){
        root.totalScore = 100
      }
      $('.answerScore_header strong').text(root.totalScore);
      clearInterval(root.timer);
      //var time = '';
      root.hour = parseInt(root.hour);
      root.minute = parseInt(root.minute);
      root.second = parseInt(root.second);
      if( !root.hour && !root.minute){
    	  root.timeText = root.second + '秒';
      }else{
        if( !root.hour ){
        	root.timeText = root.minute + '分' + root.second + '秒'
        }else{
        	root.timeText = root.hour + '小时' + root.minute + '分' + root.second + '秒'
        }
      }
      $('.use_time span').text(root.timeText);
      
      var slogan = [
        '再试试吧',
        '这可不行呦',
        '还得多学学',
        '同学，你还需努力',
        '距离“棒棒哒”还很远哒',
        '加了个油',
        '你已经略知一二',
        '还可以再厉害一点',
        '天下大事，略懂',
        '还差一丢丢，你可以的'
      ];
      if(root.totalScore < 100){
        var s = Math.ceil(root.totalScore / 10)
        $('.congratulations').text(slogan[s]);
        $('#choujiang').hide();
        $('.result').hide();
      } else {
        $('#again').hide();
      }
      nextPlay($(this));
	  getDatas();
    })
  }

  // 填空题提交问题
  function submitCompletion(){
    $('.com-butn').on('click', function(){
      var _this = $(this);
      var rightVal = _this.data('v');
      var yourVal = _this.prev().prev().find('span').text();
      var tklength = _this.prev().prev().prev().find('span')
      var arr=[];
      for(var i = 0; i < tklength.length ; i++){
      	arr.push( $(tklength[i]).text() )
      }
      arr.join()
      var yourVal = arr.join('')
      if (yourVal == "") {
        $(".tishi").text("请选择或填写答案").show();
        setTimeout(function () {
          $(".tishi").css("display", "none")
        }, 2000)
        return false;
      } else if (yourVal.length < tklength.length) {
        $(".tishi").text("请完整填写答案哦！").show();
        setTimeout(function () {
          $(".tishi").css("display", "none")
        }, 2000)
        return false;
      } else if (rightVal == yourVal) {
        root.totalScore += 10;
        confirm(_this);
        nextPlay(_this)
      }
    else {
        // var len = yourVal.length;
        // var cVal = '';
        // for(var i = 0; i < len; i++){
        //   if(yourVal[i] == rightVal[i]){
        //     cVal += '<b>' + yourVal[i] + '</b>'
        //   }else{
        //     cVal += '<i>' + yourVal[i] + '</i>'
        //   }
        // }
        renderAnswer( _this.parents('.content_box') );
        confirm(_this);
        nextPlay( _this );
      }
      mTrackData(getSerial(_this), yourVal)
    })
  }

  function getSerial(_this){
    var p = parseInt( _this.parents('.mid_content').find('.question_type').text() ) - 1;
    // console.log(p)
    var han = '一二三四五六七八九十'
    return han[p]
  }

  // 填空题作答
  function completion(){
    var box = $('.completion-box');
    $('.selective_filling span', box).on('click', function(){
      var _this = $(this);
      var val = _this.text();
      var index = _this.index();
      var mSapn = _this.parent().prev().find('span');
      var len = mSapn.length;
      var flag = true;
      if( !_this.hasClass('selected') ){
        mSapn.each(function(i, e){
          if( !$(e).text().length){
            $(e).text(val).data('i', index);
            if( i<= len ){
              flag = false
            }
            return false
          }
        })
        if(!flag){ _this.addClass('selected') }
      }
    })
    $('.par_1 span', box).on('click', function(){
      var _this = $(this);
      if( _this.text().length ){
        var index = _this.data('i');
        _this.text('').parents('.par_1').next().find('span').eq(index).removeClass('selected')
      }
    })
  }

  // 选择题提交问题
  function submitQuestion() {
    $('.butn').on('click', function () {
    root.noAnswer = false;
      var _this = $(this);
      if (_this.parents('.qbox').length > 0) {
        var isAn = checking(_this);
        if (isAn) {
          confirm(_this);
          isCorrect(_this);
          nextPlay( _this );
        }
      }else{
        nextPlay( _this )
      }

    })
  }
  function renderAnswer(_this, yourAnswers){
    var target = _this.next().find('.icon img').prop('src', 'resources/wrong.jpg').parents('.icon').next('.answer').text('回答错误')
    if (yourAnswers) {
      target.after('<span class="r_answer">'+'你的答案：' + yourAnswers+'</span>')
    }
  }

  //检查答案是否正确
  function isCorrect(_this) {
    var options = _this.prevAll('.options');
    var option = options.find(".option");
    var isJudgement = option.length == 2;
    var youAnswers = [];
    // console.log(isJudgement)
    root.rightAnswers = {};
    root.yourAnswers = '';
    root.yourAllAnswers = {};
    root.thisRight = true;
    option.each(function (i, e) {
      var isYour = $(e).hasClass('selected');
      var isRight = $(e).data('v');
      if( (!isYour && isRight) || (isYour && !isRight) ){
        root.thisRight = false;
      }
      if (isYour) {
        if (isJudgement) {
          root.yourAnswers += $(e).text();
        } else {
          root.yourAnswers += $(e).text().substring(0, 1) + '、';

          //youAnswers.push($(e).text());
        }
        /*选项和选项答案都要*/
        youAnswers.push($(e).text());
      }
      if (isRight) {
        root.rightAnswers[i] = $(e).text();
      }
    });
    if( !root.thisRight ){
      var xuanran = isJudgement ? root.yourAnswers : root.yourAnswers.substring(0, root.yourAnswers.length - 1);
      renderAnswer( _this.parents('.content_box'),  xuanran)
    }else{
        root.totalScore += 10;
    };
      // console.log(getSerial(_this))

      root.yourAnswers = youAnswers.join(',');
      mTrackData(getSerial(_this), root.yourAnswers)
  }
  
  //播放下一页
  function nextPlay(_this){
    _this.parents('.content_box').fadeOut(200).next().fadeIn(200);
    $('html , body').css({scrollTop: 0});
  }



  // 检查是否答题
  
  function checking(_this) {
    var options = _this.prevAll('.options');
    var isMultiple = options.hasClass('multiple-topics');
    var selectedLen = options.find('.selected').length;
    // console.log(selectedLen)
    if (selectedLen == 0) {
      if (!root.noAnswer) {
        _this.before($('<div class="selectAnswer">请选择或填写答案</div>'));
        root.noAnswer = true;
        setTimeout(function () {
          $(".selectAnswer").css("display", "none")
        }, 2000)
      }
      return false;
    } else if ( isMultiple && selectedLen == 1) {
      var a = $('<div class="selectAnswer">此题为多选题，请至少选择2个选项哦！</div>');
      _this.before(a);
      setTimeout(function () {
        $(".selectAnswer").css("display", "none")
      }, 2000)
      // if (_this.prev('.selectAnswer').length == 0) {
      //   _this.before(a);
      // } else {
      //   _this.prev('.selectAnswer').text('此题为多选题，请至少选择2个选项哦！')
      // };
      root.noAnswer = true;
      return false;
    } else {
      return options.find('.selected').text();      
    }
  }

  // 答选择题
  function select(){
    $('.single-topic .option').on('click', function(){
      $(this).addClass('selected').siblings().removeClass('selected')
    })
    $('.multiple-topics .option').on('click', function(){
      if( $(this).hasClass('selected') ){
        $(this).removeClass('selected')
      }else{
        $(this).addClass('selected')
      }
    })
  }
  
  //确定按钮点击
  function confirm(_this){
    data.seq = Number(_this.parents('.qbox').data('qid'));
    data.started = 1;
    count();
  }  

  //下一题按钮点击
  function nextQuestion(){
    $('.next').on('click', function(){
      var _this = $(this);
      data.started = 0;
      data.seq = Number(_this.parents('.abox').prev('.qbox').data('qid')) +1;
      data.costTime = root.time - previousQuestionTime // 时间差
      previousQuestionTime = root.time // 上一题结束的时间点
      if(data.seq === 11){return false;}
      count();
    })
  }
  function count() {
    data.totalTime = root.time;
    $.ajax({
      cache : true,
      async : true,
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (res) {
        console.log(res)
      },
      error: function (res) {
        console.log(res)
      }
    })
  }
  // 定时器
  function setTimer(){
	root.time = 0;
    root.timer = setInterval(function(){
    	root.time++;
      renderTime()
    }, 1000);
    function renderTime(){
      root.minute = fomart( Math.floor(root.time / 60) );
      root.second = fomart( root.time % 60 );
      root.hour = fomart( Math.floor( root.minute / 60 ) );
      root.minute = Number(root.minute) - (Number(root.hour)*60)
      root.minute = fomart(root.minute);
      $(".timer").text(root.hour + ":" + root.minute + ":" + root.second);
    }
    function fomart(num){
      return num < 10 ? '0' + num : num;
    }
  }

  // 布局
  function layout(){
    $content_boxs.eq(0).show();
  }
})