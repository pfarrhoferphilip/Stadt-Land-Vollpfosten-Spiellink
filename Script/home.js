/*--- Variables ---*/

let char_img_box = document.getElementById('char-select-image-box');
let refresh_img = document.getElementById('char-select-refresh-image');
let test_box = document.getElementById('test');
let dice_box = document.getElementById('char-select-username-dice-box');
let user_name = document.getElementById('char-select-username-input');
let animation_interval;
let animation_frames = [];
let current_frame_index = 0;

let important_var = new Image();
important_var.onerror = () => {
    location.reload();
};
important_var.src = './../images/doNOTdelete.jpg';

let image_array = sources.images;

//console.log(lobby_bs)

localStorage.clear();



/*--- JoinRoom() ---*/
function joinRoom() {
    let array_string;
    var inputs = document.getElementsByClassName("room-code-input");
    var values = [];

    for (var i = 0; i < inputs.length; i++) {
        values.push(inputs[i].value);
    }

    array_string = values.join("");

    console.log(array_string);

    // Wert in localStorage speichern
    localStorage['username'] = user_name.value;

    // Zum Testen können Sie den gespeicherten Wert auslesen und in der Konsole ausgeben
    let stored_username = localStorage.getItem('username');
    console.log('Gespeicherter Benutzername:', stored_username);

    window.open("./lobby.html?" + array_string, "_self");
}

function createRoom() {
    localStorage['username'] = user_name.value;

    window.open("./lobby.html?createRoom", "_self");
}

/*--- HandleInputFields ---*/

function handleInput(input_element, next_input_id) {
    input_element.value = input_element.value.replace(/[^0-9]/g, '');
    if (next_input_id && input_element.value.length === input_element.maxLength) {
        jump_next_field(next_input_id);
    }
}

function handleBackspace(input_element, prev_input_id) {
    if (event.key === "Backspace" && input_element.value.length === 0 && prev_input_id) {
        jump_next_field(prev_input_id);
    }
}

function jump_next_field(next_input_id) {
    document.getElementById(next_input_id).focus();
}

/*--- jumpNextInputField ---*/

function jumpNextField(next_input_id) {
    document.getElementById(next_input_id).focus();
}

/*--- CharacterSelect ---*/

console.log(image_array);
let currentChar = 1;
let currentIndex = 0; // Keep track of the current index of the image being displayed
function changeChar(direction) {
    currentIndex += direction; // Update the current index based on the direction

    // Check bounds to ensure it loops back to the beginning or end if necessary
    if (currentIndex < 0) {
        currentIndex = image_array.length - 1;
    } else if (currentIndex >= image_array.length) {
        currentIndex = 0;
    }

    // Save the current index to localStorage
    

    // Update the image source
    let char_img = image_array[currentIndex].source;
    localStorage['image_id'] = char_img;
    document.getElementById('char-select-image-image').src = "../images/characters/" + localStorage['image_id'];
}
function getRandomNumberFromArray(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return "Invalid array";
    }
    if (!getRandomNumberFromArray.previous_index) {
        getRandomNumberFromArray.previous_index = -1; // Initialize with an invalid index
    }
    let random_index;
    do {
        random_index = Math.floor(Math.random() * array.length) + 1;
    } while (random_index === getRandomNumberFromArray.previous_index);
    getRandomNumberFromArray.previous_index = random_index;
    return random_index;
}

/*--- RandomName ---*/

function getRandomName() {
    // Zufällige Auswahl eines firstpart-Namens
    let random_first_part = names.firstpart[Math.floor(Math.random() * names.firstpart.length)].name;

    // Zufällige Auswahl eines secondpart-Namens
    let random_second_part = names.secondpart[Math.floor(Math.random() * names.secondpart.length)].name;

    // Zusammensetzen der beiden Teile
    let random_name = `${random_first_part}${random_second_part}`;

    user_name.value = random_name;

    console.log(random_name);
}