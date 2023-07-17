var DELAY = 40;
var Speed = 5;
var dy = Speed;
var Max = 15;
//Boolean for Mouse Click
var clicking = false;
//Copter global Var
var Copter;
var cover;
var txt;
var txt2;
var gameOn = true

//Obstacle amounts
var num_Obs = 1

//Terrain = T
var TerrainW = 10;
var Min_Height = 15;
var Max_Height = 50;
var Top_T = [];
var Bot_T = [];
var T_Color = "#3bffc8";
//Arrays
var Obstacle = []; //ostacle array
var dust = []; // dust array
var bomba = []; // Bomb arrays

var TextPicker = 0; // Place holder for random text
var LooseText;

var points = 0;
var score;
//Extra Global Variables
var counter = 0;
var difficulty = 0
var keepUp = 0;

//music
var musicLost;

function start() {
   
    mouseDownMethod(up);
    mouseUpMethod(down);
    keyDownMethod(bomb);
    addTerrain();
    startSetup();
    addObs();
    menu();
    
    
}

function menu(){
    cover = new Rectangle(getWidth(), getHeight());
    cover.setPosition(0,0);
    add(cover);
    
    txt = new Text("Press F to Play", "17pt Arial");
    txt.setPosition(getWidth()/2 - txt.getWidth()/2, getHeight()/2)
    txt.setColor(T_Color);
    add(txt);
    
    txt2 = new Text("Right Click and Hold to Fly" , "12pt Arial");
    txt2.setPosition(getWidth()/2 - txt2.getWidth()/2, getHeight()/2 + txt2.getHeight()+ 19);
    txt2.setColor(T_Color);
    add(txt2);
}

function addObs(){
    for(var i = 0; i < num_Obs; i++){
        var Obs = new Rectangle(25, 100);
        Obs.setColor(T_Color);
        Obs.setPosition(getWidth() + i*(getWidth()/num_Obs) , Randomizer.nextInt(0, getHeight() - Obs.getHeight()));
        Obstacle.push(Obs);
        add(Obs);
    }
    
}

function moveObs(){
    for(var i = 0; i < Obstacle.length; i++){
        var Obs = Obstacle[i];
        Obs.move(-10, 0);
        if (Obs.getX() < -25) {
            Obs.setPosition(getWidth(),Randomizer.nextInt(25, getHeight() - Obs.getHeight()));
        }
    }
}


function startSetup() {
    setBackgroundColor(Color.black);
    Copter = new Rectangle(30, 15);
    Copter.setPosition(getWidth() / 3 - 50, getHeight() / 2);
    Copter.setColor(Color.green);
    add(Copter);
    
    
    addTerrain();

    score = new Text(points, "15pt Arial");
    score.setColor(Color.red);
    score.setPosition(10,30);
    add(score);
    
  
}

function game() {
    //Score keep
    updateScore();
    increaseDiff();
    //Movement of the Helicopter
    if (clicking) {
        dy -= 1.5;
        if (dy < -Max) {
            dy = -Max;
        }
    } else {
        dy += 1.5;
        if (dy > Max) {
            dy = Max;
        }
    }
    Copter.move(0, dy);

    //Moving Obstacles
    moveObs();
    SlideTerrain();
    
    // Loosing Conditions 
    if (Copter.getY() < 0 || Copter.getY() > getHeight()) {
        Loose();
    }
    var Collide = detectCollision(); //will loose if you hit any obstacle or the terrains
    if (Collide != null ){
        Loose();
        return;
    }
    //dust
    addDust();
    airCurrent();
    //Shooting Control and funtion
    bombMove();
    
   
}

function up(e) {
    clicking = true;
}

function down(e) {
    clicking = false;
}

function updateScore(){
    points = points + 2
    score.setText(points);
    
}

function Loose() {
    
    var num = Randomizer.nextInt(0, 5);
    TextPicker = num;


    if (TextPicker == 1) {
        LooseText = "That's Unfortunate.";
    } else if (TextPicker == 2) {
        LooseText = "Kaboom!";
    } else if (TextPicker == 3) {
        LooseText = "You lose!";
    } else if (TextPicker == 4) {
        LooseText = "Try flying more";
    } else {
        LooseText = "Watch out!";
    }


    var text = new Text(LooseText, "15pt Arial");
    text.setColor(Color.red);
    text.setPosition(getWidth() / 2 - text.getWidth() / 2, getHeight() / 2);
    add(text);
    musicLost.pause();
    stopTimer(game);
    var lost = new Audio("https://codehs.com/uploads/973f104f07786dfb3d717ae84b5ab013")
    lost.play();
    
}


function detectCollision(){
    
    var topLeft = getElementAt(Copter.getX() - 1, Copter.getY() - 1);
    if (topLeft != null){
        return topLeft;
    }
    
    var topRight = getElementAt(Copter.getX() + Copter.getWidth() + 1, Copter.getY() - 1)
        
    if (topRight != null){
        return topRight;
    }
    
    var bottomLeft = getElementAt(Copter.getX() - 1, Copter.getY() + Copter.getHeight() -1);
    if (bottomLeft != null){
        return bottomLeft;
    }
    
    var bottomRight = getElementAt(Copter.getX() + Copter.getWidth() + 1, Copter.getY() + Copter.getHeight() - 1)
    if (bottomRight != null){
        return bottomRight;
    }
    
    var top = getElementAt(Copter.getX() + Copter.getWidth()/2, Copter.getY() - 1);
    if (top != null){
        return top;
    }
    
    var bot =  getElementAt(Copter.getX() + Copter.getWidth()/2, Copter.getY() + 1 + Copter.getHeight());
    if(bot != null){
        return bot;
    }
}

function music(){
    musicLost = new Audio("https://codehs.com/uploads/fadc63ca3fe99c049a54fc4230bee368")
    musicLost.play();
    
    //https://static.codehs.com/audio/tamagotamagotamagotchi.m4a
}

function addTerrain(){
    
    for(var i = 0; i <= getWidth()/ TerrainW; i++){
        var height = Randomizer.nextInt(Min_Height, Max_Height)
        var terrain = new Rectangle(TerrainW, height);
        terrain.setPosition(TerrainW * i, 0);
        terrain.setColor(T_Color);
        Top_T.push(terrain);
        add(terrain);
        
        var height = Randomizer.nextInt(Min_Height, Max_Height)
        var Bterrain = new Rectangle(TerrainW, height);
        Bterrain.setPosition(TerrainW * i, getHeight() - height);
        Bterrain.setColor(T_Color);
        Bot_T.push(Bterrain);
        add(Bterrain);
    }
    
}

function SlideTerrain(){
    for (var i = 0; i < Top_T.length; i++){
        var obj = Top_T[i];
        obj.move(-5, 0);
        if(obj.getX() < -obj.getWidth()){
            obj.setPosition(getWidth()-5, 0)
            
        }
    }
    
    for (var i = 0; i < Bot_T.length; i++){
        var obj = Bot_T[i];
        obj.move(-5, 0);
        if(obj.getX() < -obj.getWidth()){
            obj.setPosition(getWidth()-5, getHeight() - obj.getHeight())
            
        }
    }
}

function addDust(){
    var d = new Circle(3);
    d.setColor("#dccccc");
    d.setPosition(Copter.getX()-d.getWidth(), Copter.getY()+10);
    dust.push(d);
    add(d);
}

function airCurrent(){
    for(var i = 0; i < dust.length; i++){
        var d = dust[i];
        d.move(-5, 0);
        d.setRadius(d.getRadius() - 0.1);
        if (d.getX() == 0){
            remove(d)
            
        }
        
    }
}

function increaseDiff(){
    keepUp = keepUp + 2
    if(keepUp == 1000){
        num_Obs++;
        addObs();
        keepUp = 0;
        T_Color = Color.red;
    }
}

function Shooter(){
    if(points == 500){
        return true;
    }
}

function detect(){
    if (Shooter = true){
        stopTimer(game);
        var txt = new Text("You have powered up (press space to fire)", "15pt Arial");
        txt.setPosition(getWidth()/2 - txt.getWidth()/2, getHeight()/2);
        txt.setColor(Color.green);
        add(txt);
    }
    
}


function bomb(e){
    
    
    if(e.keyCode == Keyboard.SPACE && counter > 50){
        var bomb = new Circle(3);
        bomb.setColor(Color.red);
        bomb.setPosition(Copter.getX()+ Copter.getWidth() + 10, Copter.getY()+10);
        bomba.push(bomb);
        add(bomb);
        counter = 0;
    }
    
    if(e.keyCode == Keyboard.letter('Q')){
        stopTimer(game)
    }
    
    if(e.keyCode == Keyboard.letter('F') && gameOn){
        remove(cover);
        remove(txt);
        remove(txt2);
        setTimer(game, DELAY);
        music();
        gameOn = false
    }
    
    
}

function bombMove(){
    var v = 2
    v = v + 0.1
    counter = counter + v
    for(var i = 0; i < bomba.length; i++){
        var d = bomba[i];
        d.move(10, 0);
        
        if (d.getX() == getWidth()){
            remove(d)
        }
        
        var leftc = getElementAt(d.getX() + d.getRadius(), d.getY());
        if(leftc != null){
            leftc.setPosition(getWidth() + 100, Randomizer.nextInt(0, getHeight() - leftc.getHeight()))
            remove(d)
        }
        
    }
}
start();
