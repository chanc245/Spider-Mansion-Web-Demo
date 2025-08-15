let sceneStartTime = 0;
let waitTime = 5000;
let lastScene = -1; // track scene changes once

function scene0() {
  showInputUI = false;
  toggleCommandDivVisibility();

  background(245);
  image(scene0_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  push();
  selectSectionGoto(740, 974, 387, 436, 1); //New Game
  selectSection(830, 975, 434, 482); //credit
  selectSection(830, 975, 481, 529); //about

  S0about.display();
  S0about.exit();
  S0credit.display();
  S0credit.exit();
  pop();
}

function scene1() {
  push();
  image(scene1_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  if (showEnter) nextScene(437, 587, 440, 490, 2, "Enter");

  entrence_diaBox.display();
  pop();
}

function scene2() {
  push();
  image(scene2_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  // show "End Investigation" only after 3s in this scene
  if (millis() - sceneStartTime > waitTime) {
    nextScene(392, 632, 650, 735, 3, "End Investigation");
  }

  attic_diaBox.display();

  showHintDia(400, 210, () => attic_obs_bear.display());
  showHintDia(640, 330, () => attic_obs_music.display());
  showHintDia(865, 200, () => attic_obs_mirror.display());
  pop();
}

function scene3() {
  push();
  image(scene3_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  // image(normal_2eye, 0, 50, chW * imgCom, chH * imgCom);
  attic_diaBox_talk.display();
  pop();
}

function scene4() {
  push();
  image(scene4_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  // show "Go back to Attic" only after 3s in this scene
  if (millis() - sceneStartTime > waitTime) {
    nextScene(392, 632, 650, 735, 5, "Go back to Attic");
  }

  kitchen_diaBox.display();

  showHintDia(150, 130, () => kitchen_obs_pot.display());
  showHintDia(580, 120, () => kitchen_obs_utensil.display());
  showHintDia(870, 20, () => kitchen_obs_book.display());
  showHintDia(820, 250, () => kitchen_obs_dish.display());
  showHintDia(730, 420, () => kitchen_obs_food.display());
  pop();
}

function scene5() {
  push();
  image(scene3_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  // image(normal_2eye, 0, 50, chW * imgCom, chH * imgCom);
  kitchenObs_diaBox_talk.display();
  pop();
}

function scene6() {
  showInputUI = true;
  toggleCommandDivVisibility();

  push();
  image(scene6_Img, 0, 0, bgW * imgCom, bgH * imgCom);

  S6rules.display();
  S6rules.exit();
  S6clues.display();
  S6clues.exit();
  S6ready.display();
  S6ready.exit();
  S6answer.display();
  S6answer.exit();

  if (mouseWithin(291, 341, 120, 160) && mouseIsPressed) {
    ansInput.show();
  }

  selectSectionGotoNoline(462, 562, 135, 170, 7);
  pop();
}

function scene7() {
  showInputUI = false;
  toggleCommandDivVisibility();

  push();
  ansInput.hide();
  image(scene3_Img, 0, 0, bgW * imgCom, bgH * imgCom);
  attic_diaBox_end.display();
  pop();
}

function scene8() {
  push();
  image(scene8_Img, 0, 0, bgW * imgCom, bgH * imgCom);
  pop();
}

function changeScene() {
  // set sceneStartTime ONCE when entering a new scene
  if (locationNum !== lastScene) {
    sceneStartTime = millis();
    lastScene = locationNum;
  }

  switch (locationNum) {
    case 0:
      scene0();
      break;
    case 1:
      scene1();
      break;
    case 2:
      scene2();
      break;
    case 3:
      scene3();
      break;
    case 4:
      scene4();
      break;
    case 5:
      scene5();
      break;
    case 6:
      scene6();
      break;
    case 7:
      scene7();
      break;
    case 8:
      scene8();
      break;
  }
}
