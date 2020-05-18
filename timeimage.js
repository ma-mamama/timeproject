(function() {
'use strict';

var TOP = 10;
var LEFT = 10;
var WIDTH = 100; // 画像の幅(ピクセル数)
var HEIGHT = 100; // 画像の高さ(ピクセル数)
var SHIFT_DIV = 3;
var HOUR_IDX = 0;
var SEP1_IDX = 2;
var MINUTE_IDX = 3;
var SEP2_IDX = 5;
var SECOND_IDX = 6;
var NUM_IDX = 8;

var digFiles = ['0.png', '1.png', '2.png', '3.png', '4.png', 
                 '5.png', '6.png', '7.png', '8.png', '9.png'];
var sep1File = 'colon1.png';//時間画像
var sep2File = 'colon2.png';//分画像
var initFiles = [ digFiles[0], digFiles[0], sep1File,
                  digFiles[0], digFiles[0], sep2File,
                  digFiles[0], digFiles[0] ];
var images = new Array(NUM_IDX);
function posX(idx) {
    return LEFT + idx * WIDTH;
}

function posY(idx) {
    return TOP + Math.floor(idx % 3 == 2 ? HEIGHT / SHIFT_DIV : 0);
}

function setDigit(idx, dig) {
    images[idx].src = digFiles[dig];
    images[idx].style.left = posX(idx) + 'px';
    images[idx].style.top = posY(idx) + 'px';
}

// 時間に応じてシアン色成分の強さを変化させた背景色を求める
function bg(hour) {
    var a = (hour > 12 ? 24 - hour : hour);//?はtrueかfalseかの三項演算子
    a = a * 15 + 70;
    var aa = a.toString(16); // 必ず2桁になる
    return '#' + '44' + aa + aa; // シアン色成分変化
    //return '#' + aa + '44' + aa; // 黄色成分変化
    //return '#' + aa + aa + '44'; // マゼンタ色成分変化
}

var TimeImageUpdater = function() {
    this.hour1 = -1;
    this.hour2 = -1;
    this.minute1 = -1;
    this.minute2 = -1;
    this.second1 = -1;
    this.second2 = -1;
    this.update();
};

TimeImageUpdater.prototype = {
  update: function() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var d2 = h % 10;
    var d1 = (h - d2) / 10;
    if (d1 !== this.hour1) {
        this.hour1 = d1;
        setDigit(HOUR_IDX, d1);
    }
    if (d2 !== this.hour2) {
        this.hour2 = d2;
        setDigit(HOUR_IDX + 1, d2);
        document.body.style.backgroundColor = bg(h);
    }
    d2 = m % 10;
    d1 = (m - d2) / 10;
    if (d1 !== this.minute1) {
        this.minute1 = d1;
        setDigit(MINUTE_IDX, d1);
    }
    if (d2 !== this.minute2) {
        this.minute2 = d2;
        setDigit(MINUTE_IDX + 1, d2);
    }
    d2 = s % 10;
    d1 = (s - d2) / 10;
    if (d1 !== this.second1) {
        this.second1 = d1;
        setDigit(SECOND_IDX, d1);
    }
    if (d2 !== this.second2) {
        this.second2 = d2;
        setDigit(SECOND_IDX + 1, d2);
    }

    // thisを束縛してコールバックに指定しているので、二回目以降の呼び出しも正常に行われる。
    // thisをオブジェクトに束縛した関数をsetTimeout に渡す
    setTimeout( this.update.bind(this), 500 ); // 500ミリ秒 = 0.5秒後に実行する
  }
};

for (var i = 0; i < NUM_IDX; i++) {
    images[i] = new Image();
    images[i].src = initFiles[i];
    images[i].style.left = posX(i) + 'px';//pxに変換
    images[i].style.top = posY(i) + 'px';//pxに変換
    images[i].style.position = 'absolute';//絶対位置
}


document.addEventListener('DOMContentLoaded', function() {
	//var elem = timeimage;
	var elem = document.getElementById('timeimage');
    elem.style.position = 'relative';
	//elem.style.border = 'solid black 1px';
	elem.style.width = (LEFT * 2 + NUM_IDX * WIDTH) + 'px';
	elem.style.height = (TOP * 2 + Math.floor((1 + 1/SHIFT_DIV) * HEIGHT)) + 'px';

	//for (var i = 0; i < NUM_IDX; i++) {
	//    elem.appendChild(images[i]);
	//}
    images.forEach(function(img) { elem.appendChild(img); });

	var updater = new TimeImageUpdater();
});

}());
