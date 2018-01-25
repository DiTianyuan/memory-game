/*
 * 创建一个包含所有卡片的数组
 */
var cards = new Array();
var li = $(".deck").children("li");
function getList() {
    for (var i = 0; i < li.length; i++) {
        cards[i] = li[i];
    }
    return cards;
}
getList();

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */


// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//重置卡片HTML
function resetHTML(x) {
    var list = $(x);
    $(".deck").append(list);
}

//页面载入时随机排列卡片
$(document).ready(function(){
    shuffle(cards);
    $(".deck").empty();
    cards.forEach(resetHTML);
})

//洗牌并重置页面（初始化）
function initialize() {
    // 停止计时，时间归零并显示在页面
    stopTimer();
    time = 0;
    t = 0;
    $(".seconds").text(time);
    //计步器归零
    moves = 0;
    $(".moves").text(moves);
    //计分器还原
    stars = 3;
    $(".star1").attr("class", "fa fa-star star1");
    $(".star2").attr("class", "fa fa-star star2");
    $(".star3").attr("class", "fa fa-star star3");
    //还原卡片为覆盖状态
    $(".deck").children("li").attr("class", "card");
    //卡片重排
    shuffle(cards);
    $(".deck").empty();
    cards.forEach(resetHTML);
}

//点击repeat图标后初始化页面
$(".restart").click(function() {
    initialize();
});


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */

//一个数组，储存翻开待检查的卡片
var open = new Array();

function checkWhetherMatch() {
    if(open.length === 2) {
        var open1 = $(open[0]), open2 = $(open[1]);
        var symbol1 = $(open1).children("i").attr("class");
        var symbol2 = $(open2).children("i").attr("class");
        function alert() {
            $(open1).attr("class", "card wrong");
            $(open2).attr("class", "card wrong");
        }
        function notMatch() {
            $(open1).removeClass("open wrong");
            $(open2).removeClass("open wrong");
        }
        //若匹配，给两张卡片添加card match类
        if(symbol1 === symbol2) {
            $(open1).attr("class", "card match");
            $(open2).attr("class", "card match");
        }
        //若不匹配，还原两张卡片的类
        else {
            alert();
            setTimeout(notMatch,500);
        }
        open = [];//检查结束清空open数组

        //计步并显示在页面
        moveCounter();
        $(".moves").text(moves);
    }
}

//计步器
var moves = 0;
function moveCounter() {
    moves += 1;
}

//计分
var stars = 3;
function score() {
    if(moves >= 15 && moves < 20) {
        $(".star3").attr("class", "fa fa-star-o star3")
        stars = 2;
    }
    else if(moves > 20) {
        $(".star3").attr("class", "fa fa-star-o star3")
        $(".star2").attr("class", "fa fa-star-o star2")
        stars = 1;
    }
}

//计时器
var time = 0, t = 0;
function startTimer() {
    t = setInterval(function(){timer()}, 1000);
    function timer() {
        time += 1;
        $(".seconds").text(time);
    }
}
function stopTimer() {
    clearInterval(t);
}

//检查全部卡片的class以确定是否均已匹配
function checkAllClass(x) {
    if ($(x).attr("class") === "card match") {
        return true;
    }
}

//若游戏胜利，计时器停止，显示模态框
function won() {
    stopTimer();
    $("#myModal").modal();
    $(".moves-num").text(moves);
    $(".stars-num").text(stars);
    $(".seconds-num").text(time);
    // alert("Congratulations! You Won!\nWith " + moves + " Moves and " + stars + "Stars in " + time + " seconds.");
}

//模态框隐藏后初始化页面
$("#myModal").on("hidden.bs.modal", function() {
    initialize();
});

//单击事件发生时
$(".deck").on("click", ".card", function(evt) {
    //开始计时并显示在页面
    if (t === 0) {
        startTimer();
    }

    $(evt.target).addClass("open"); //给被单击的卡片添加open show类，显示卡片的符号
    open.push($(evt.target)); //将卡片添加到open数组中

    //检查翻开的两张卡片是否匹配
    checkWhetherMatch(open);

    //根据步数显示星级评分
    score();

    cards.every(checkAllClass); //检查卡片是否已全部匹配
    if (cards.every(checkAllClass) === true) {
        won(); //游戏胜利执行won()
    }
});

