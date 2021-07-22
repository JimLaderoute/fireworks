
const DEFAULT_NPARTICLES = 300;
const DEGREES_TO_RADIANS = 0.0174533;
//window.addEventListener("load", startup, false);
let fireworksData = [];
let canvas = document.getElementById('icanvas');
//canvas.width = window.innerWidth * 0.55;
//canvas.height = window.innerHeight * 0.50;
//window.onresize = mainWindowResizedEvent;
//let mytitle = document.getElementById('mytitle');
//let rect = mytitle.getBoundingClientRect();
//mytitle.style.left = "100px";

// console.log(rect.top, rect.right, rect.bottom, rect.left);

let ctx = canvas.getContext('2d');
let emitters = [];
//let particleForces:Array<Force> = [];
let nparticles = DEFAULT_NPARTICLES;
let pcolor = "#000000";
let palpha = "1.0";
let color = new Color(0, 0, 0);

function mainWindowResizedEvent() {
//    canvas.width = window.innerWidth * 0.55;
//    canvas.height = window.innerHeight * 0.50;
}

function fadeScreen() {
    // get global background color 
    let c = new Color();
    c.setHex(e_gColor.value);
    
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loadsettings() {
   
    let input = document.getElementById('loadsettings');
    var fReader = new FileReader();
    fReader.readAsText(input.files[0]);
    fReader.onloadend = function(event) {
        emitters = [];
        fireworksData = event.target.result.split("\n");
        for( let i =0; i < fireworksData.length; i++){
            fireworksData[i] = remove_linebreaks(fireworksData[i]);
        }
        loadFireWorks();
    }
}


function savesettings() {
  
    let settingsList = [];
    settingsList.push( getGlobals() );
    emitters.forEach( e => {
        settingsList.push(e.getEmitterSettings());
    });
    saveStrings( settingsList, "fireworks.txt");
}

function runcommands() {
    let datumArray = e_textArea.value.split("\n");
    if (datumArray) {
        for( let i =0; i < datumArray.length; i++){
            datumArray[i] = remove_linebreaks(datumArray[i]);
        }
        clearScreen();
        emitters = [];
        fireworksData = datumArray;
        loadFireWorks();
    }
}

function copytoclipboard() {
    if (e_textArea.select) {
        e_textArea.select();
        document.execCommand("copy");
    }
    if ( window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    if (document.selection.empty) {
        document.selection.empty();
    }
}

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function deleteLast() {
    emitters.pop();
    updateTextArea();
}
function rotateToBottom() {
    let foobar = emitters.pop();
    emitters.unshift(foobar);
    updateTextArea();
}
function resetAll() {
    emitters = [];
    updateTextArea();
}

function preload() {
    //    loadFireWorks( "http://127.0.0.1:5500/simulations/fireworks/fireworks.txt");
    fireworksData = loadStrings('fireworks.txt');
}

function setup() {
    let b1 = document.getElementById("resetAll");
    let b2 = document.getElementById("deleteLast");
    let b3 = document.getElementById("rotate");
    let b4 = document.getElementById("loadsettings");
    let b5 = document.getElementById("savesettings");
    let b6 = document.getElementById("copytoclipboard");
    let b7 = document.getElementById("runcommands");

    if (b1)
        b1.addEventListener("click", resetAll, false);
    if (b2)
        b2.addEventListener("click", deleteLast, false);
    if (b3)
        b3.addEventListener("click", rotateToBottom, false);
    if (b4)
        b4.addEventListener("change", loadsettings, false);
    if (b5)
        b5.addEventListener("click", savesettings, false);
    if (b6)
        b6.addEventListener("click", copytoclipboard, false);
    if (b7)
        b7.addEventListener("click", runcommands, false);
    
    e_gColor.addEventListener("input", (evt) => {
        canvas.style.background = evt.target.value;
        updateTextArea();
    }, false); /* is fired on the <input> element every time the color changes */
    e_gColor.addEventListener("change", (evt) => {
        canvas.style.background = evt.target.value;
        updateTextArea();
    }, false); /* is fired when the user dismisses the color picker */
    e_gColor.select();
    canvas.style.background = e_gColor.value;

    pcolor = e_Color.value;
    palpha = e_Alpha.value;
    e_Color.addEventListener("input", (evt) => {
        pcolor = evt.target.value;
    }, false); /* is fired on the <input> element every time the color changes */
    e_Color.addEventListener("change", (evt) => {
        pcolor = evt.target.value;
    }, false); /* is fired when the user dismisses the color picker */
    e_Color.select();
    e_Alpha.addEventListener("change", (evt) => {
        if (parseFloat(e_Alpha.value) > 1.0) {
            e_Alpha.value = "1.0";
        }
        if (parseFloat(e_Alpha.value) < 0) {
            e_Alpha.value = "0";
        }
    });
    canvas.addEventListener('mousedown', function (event) {
        event.preventDefault();
        let rect = canvas.getBoundingClientRect();
        mousedown(event.clientX - rect.left, event.clientY - rect.top);
    });
    canvas.addEventListener('mouseup', function (event) {
        event.preventDefault();
        let rect = canvas.getBoundingClientRect();
        mouseup(event.clientX - rect.left, event.clientY - rect.top);
    });

    loadFireWorks();

}

//emitter style serial color 255 0 0 alpha 0.2 size 2 shrink -0.01 newtons 2.4 angle 90 accel 0.01 random_newtons true random_angle true

function addEmitter(strArray) {
    let i = 0;
    let serialRelease;
    let color;
    let alpha;
    let shrink_r;
    let newtons;
    let angle;
    let accel;
    let random_newtons = true;
    let random_angle = true;
    let nparticles = DEFAULT_NPARTICLES;
    let x=0;
    let y=0;
    let r=1.0;

    while (i < strArray.length) {
        i++;
        switch(strArray[i]) {
            case "r":
                i++;
                r = parseFloat( strArray[i]);
                break;
            case 'px':
                i++;
                x = canvas.width * parseFloat( strArray[i] );
                break;
            case 'py':
                i++;
                y = canvas.height * parseFloat( strArray[i] );
                break;
            case 'style':
                i++;
                serialRelease = strArray[i]=="serial"?true:false;
                break;
            case 'nparticles':
                i++;
                nparticles = parseInt( strArray[i]);
                break;
            case 'color':
                {
                    let r, g, b;
                    i++;
                    r = parseInt( strArray[i]); i++;
                    g = parseInt( strArray[i]); i++;
                    b = parseInt( strArray[i]);
                    color = new Color(r,g,b);
                }
                break;
            case 'alpha':
                i++;
                alpha = parseFloat(strArray[i]);
                color.setAlpha(alpha);
                break;
            case 'shrink':
                i++;
                shrink_r = parseFloat( strArray[i] );
                break;
            case 'newtons':
                i++;
                newtons = parseFloat( strArray[i] );
                break;
            case 'angle':
                i++;
                angle = parseFloat( strArray[i] );
                break;
            case 'accel':
                i++;
                accel = parseFloat( strArray[i] );
                break;
            case 'random_newtons':
                i++;
                random_newtons = strArray[i]=="true"?true:false;
                break;
            case 'random_angle':
                i++;
                random_angle = strArray[i]=="true"?true:false;
                break;
        }
    }
    //constructor(forces, nparticles, serialRelease, x, y, r, shrink_r, color)
    let particleForces = [new Force('impulse', newtons, angle, accel, random_newtons, random_angle)];
    let emit = new Emitter(particleForces, nparticles, serialRelease, x, y, r, shrink_r, color);
    emitters.push(emit);
}

function getGlobals() {
    let returnstring = "global ";
    let r=0;
    let g=0;
    let b=0;
    let c = new Color();
    c.setHex(e_gColor.value);
    r = c.r;
    g = c.g;
    b = c.b;

    returnstring += `background ${r} ${g} ${b} `;
    returnstring += `newtons ${e_gNewtons.value} `;
    returnstring += `angle ${e_gAngle.value} `;
    returnstring += `accel ${e_gAccel.value} `;
    returnstring += `random_newtons ${e_gRandom_newtons.checked} `;
    returnstring += `random_angle ${e_gRandom_angle.checked} `;
    returnstring += `fade ${e_gFadeAll.checked}`;

    return returnstring;
}
// global background 0 0 0 newtons 0 angle 90 accel -0.015 random_newtons false random_angle false fade true
function setGlobals( words ) {
    let i = 0;

    while (i < words.length) {
        i++;
        switch(words[i]) {
            case 'background': {
                let r, g, b;
                i++;
                r = parseInt( words[i]); i++;
                g = parseInt( words[i]); i++;
                b = parseInt( words[i]);
                let c = new Color(r,g,b);
                let hexvalue = c.getHex();
                canvas.style.background = hexvalue;
                e_gColor.value = hexvalue;
                break;
            }
            case 'newtons':
                i++;
                e_gNewtons.value = words[i];
                break;
            case 'angle':
                i++;
                e_gAngle.value = words[i];
                break;
            case 'accel':
                i++;
                e_gAccel.value = words[i];
                break;
            case 'random_newtons':
                i++;
                e_gRandom_newtons.checked = words[i]=="true"?true:false;
                break;
            case 'random_angle':
                i++;
                e_gRandom_angle.checked = words[i]=="true"?true:false;
                break;
            case 'fade':
                i++;
                e_gFadeAll.checked = words[i]=="true"?true:false;
                break;
        }
    }
}

function loadFireWorks() {
    for (let aline in fireworksData) {
        let words = fireworksData[aline].split(" ");
        switch(words[0]) {
            case 'global':
                setGlobals(words);
                break;
            case 'emitter':
                addEmitter(words);
                break;
        }
    }
    updateTextArea();
}

function updateTextArea() {
    // now show this in the text area e_textArea
    let lines = "";
    //global background 0 0 0 newtons 0 angle 90 accel -0.015 random_newtons false random_angle false fade true
    lines += getGlobals();
    emitters.forEach( e => {
        lines += '\n';
        lines += e.getEmitterSettings();
    });
    e_textArea.value = lines;
}

function mouseup(x, y) {
   
}
function mousedown(x, y) {
   
    let Newtons = parseFloat(e_Newtons.value);
    let Angle = parseInt(e_Angle.value) * DEGREES_TO_RADIANS;
    let Accel = parseFloat(e_Accel.value);
    let RandomNewtons = e_Random_newtons.checked;
    let RandomAngle = e_Random_angle.checked;
    let Alpha = parseFloat(e_Alpha.value);
    let Size = parseFloat(e_Size.value); /* this is the 'r' value */
    if (!Size) {
        Size = 20;
    }
    let ShrinkR = parseFloat(e_ShrinkR.value);
    if (!ShrinkR) {
        ShrinkR = 0;
    }
    color.setHex(pcolor);
    color.setAlpha(Alpha);

    let particleForces = [new Force('impulse', Newtons, Angle, Accel, RandomNewtons, RandomAngle)];
    let e = new Emitter(particleForces, nparticles, e_serial_emitter.checked, x, y, Size, ShrinkR, color);
    e.setAlpha(Alpha);
    emitters.push(e);
    updateTextArea();
}
let globalForce;
let oldNewtons, oldAngle, oldAccel, oldRandomNewtons, oldRandomAngle;
let first=true;

function mainLoop() {
    let gFadeAll = e_gFadeAll.checked;
    let gNewtons = parseFloat(e_gNewtons.value);
    let gAngle = parseFloat(e_gAngle.value) * DEGREES_TO_RADIANS;
    let gAccel = parseFloat(e_gAccel.value);
    let gRandomNewtons = e_gRandom_newtons.checked;
    let gRandomAngle = e_gRandom_angle.checked;
    if (gFadeAll) {
        fadeScreen();
    }
    else {
        clearScreen();
    }
    let wasChanged=false;
    if ( ! first) {
        let changed=0;
        // see if values changed
        if ( oldNewtons !== gNewtons) changed++;
        if ( oldAngle !== gAngle) changed++;
        if ( oldAccel !== gAccel) changed++;
        if ( oldRandomAngle !== gRandomAngle) changed++;
        if ( oldRandomNewtons !== gRandomNewtons) changed++;
        wasChanged = changed>0;
    }
    if (first || wasChanged ) {
        globalForce = new Force('global', gNewtons, gAngle, gAccel, gRandomNewtons, gRandomAngle);
        first = false;
        oldNewtons = gNewtons;
        oldAngle = gAngle;
        oldAccel = gAccel;
        oldRandomNewtons = gRandomNewtons;
        oldRandomAngle = gRandomAngle;
        updateTextArea();
    }

    emitters.forEach(em => {
        em.applyForce(globalForce);
        em.update();
    });
    emitters.forEach(em => {
        em.draw(ctx);
    });
}
let e_gFadeAll = document.getElementById('g_fadeall');
let e_gNewtons = document.getElementById('g_newtons');
let e_gAngle = document.getElementById('g_angle');
let e_gAccel = document.getElementById('g_accel');
let e_gRandom_newtons = document.getElementById('g_random_newtons');
let e_gRandom_angle = document.getElementById('g_random_angle');
let e_gColor = document.getElementById('g_color');
let e_Newtons = document.getElementById('newtons');
let e_Angle = document.getElementById('angle');
let e_Accel = document.getElementById('accel');
let e_Random_newtons = document.getElementById('random_newtons');
let e_Random_angle = document.getElementById('random_angle');
let e_serial_emitter = document.getElementById('serial');
let e_Color = document.getElementById('l_color');
let e_Alpha = document.getElementById('alpha');
let e_Size = document.getElementById('size');
let e_ShrinkR = document.getElementById('shrink_r');
e_serial_emitter.checked = true;
let e_textArea = document.getElementById('settings');
let theInterval = setInterval(mainLoop, 20);

