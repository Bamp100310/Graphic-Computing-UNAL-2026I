boolean isOrtho = false;

void setup() {
  size(800, 600, P3D); // P3D activa el renderizador OpenGL de Processing
  noStroke();
}

void draw() {
  background(30);
  lights();
  
  if (isOrtho) {
    ortho(-width/2, width/2, -height/2, height/2, -500, 500); 
  } else {
    float fov = PI/3.0;
    float cameraZ = (height/2.0) / tan(fov/2.0);
    perspective(fov, float(width)/float(height), cameraZ/10.0, cameraZ*10.0);
  }
  
  translate(width/2, height/2, 0);
  
  rotateY(map(mouseX, 0, width, -PI, PI));
  rotateX(map(mouseY, 0, height, PI, -PI));

  pushMatrix();
  translate(-150, 0, 150);
  fill(255, 50, 50);
  box(60);
  popMatrix();

  pushMatrix();
  translate(0, 0, 0);
  fill(50, 255, 50);
  sphere(40);
  popMatrix();

  pushMatrix();
  translate(150, 0, -150);
  fill(50, 150, 255);
  box(60);
  popMatrix();
  
  hint(DISABLE_DEPTH_TEST);
  camera();
  noLights();
  fill(255);
  textSize(20);
  text("Cámara: " + (isOrtho ? "ORTOGONAL" : "PERSPECTIVA") + " (Presiona ESPACIO para cambiar)", 20, 40);
  hint(ENABLE_DEPTH_TEST); 
}

void keyPressed() {
  if (key == ' ') {
    isOrtho = !isOrtho;
  }
}
