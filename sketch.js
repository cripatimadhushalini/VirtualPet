const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var dog,sadDog,happyDog;
var foodObj;
var foodS,foodStock;
var database;
var fedTime,FeedTime, lastfed, feed; 


function preload(){
  bg = loadImage("background.jpg");
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup(){
  database = firebase.database();
  var canvas = createCanvas(1200,400);
  //engine = Engine.create();
  //world = engine.world;
  foodObj = new Food();
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  dog = createSprite(800,200,100,100);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog)

  addfood = createButton("Add Food");
  addfood.position(800,95);
  addfood.mousePressed(addFoods);
}

function draw(){
  background(46,139,87);
  // Engine.update(engine);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastfed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  
  if(lastfed>=12){
    text("LastFeed : " + lastfed%12+ " pm",350,30)
  }else if(lastfed==0){
    text("LastFeed : 12 am",350,30)
  }else{
    text("LastFeed : " + lastfed + " am",350,30);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updatefoodStock(foodS);
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);
  if(foodObj.getfoodStock()<=0){
    foodObj.updatefoodStock(foodObj.getfoodStock()*0)
  }else{
    foodObj.updatefoodStock(foodObj.getfoodStock()-1);
  }
  
  database.ref('/').update({
  Food:foodObj.getfoodStock(),
  FeedTime:hour()
  })
}