import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elcfvoujpelpwbufwyze.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY2Z2b3VqcGVscHdidWZ3eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzODk4OTAsImV4cCI6MTk5Mzk2NTg5MH0.UZSUFFiAD2vcFSDP_aYdFawaQNlSol8b6yqBTSbbcS4"
const supabase = createClient(supabaseUrl, supabaseKey)
const db = 'hangman'


async function getScore() {
    const { data, error } = await supabase
        .from(db)
        .select('id,name,score')
        .limit(1)
        .single()

    return data
}

async function updateScore(name, score) {


    let highscoreData = await getScore()
    const { error } = await supabase
        .from(db)
        .update({ name: name, score: score })
        .eq('id', highscoreData['id'])
}



// REMIND SELF TO FIX GAME- UPDATES SCORE AFTER RELOADING




async function start() {
    // SETUP

    // Local storage set up
    let score = 0


    // ALL VARIABLES  
    let imageIndex = 0
    let output = document.querySelector("#output")
    let secret = await getRandomWord()
    let secretArr = secret.split("");
    let word = document.querySelector("#word")
    let wrong = document.querySelector("#wrong")
    let incorrect = []
    let blankArr = []
    console.log(secret)
    let highscore = await getScore()
    console.log(highscore)
    // Gets button + hides button and answer + Sets up button                     
    let buttonEl = document.querySelector("#button")
    buttonEl.style.display = "none"
    word.style.display = "none"
    buttonEl.addEventListener('click', () => {
        location.reload()
    });
    let reset_highscores = document.querySelector("#reset");
    reset_highscores.addEventListener('click', () => {
        updateScore("Empty", 20000)
    })



    // Places - each letter of the word
    for (let i = 0; i < secretArr.length; i++) {
        blankArr[i] = "_"
    }


    // Combines the - 
    output.innerHTML = blankArr.join(" ")
    let letterElem = document.querySelector("#letter")


    // When enter is clicked, it converts to lowercase and checks if it's correct or not
    letterElem.addEventListener('keydown', async (event) => {
        // If enter is clicked, it runs process
        if (event.key == "Enter") {

            let letter = letterElem.value.toLowerCase()


            // If the letter is right, it replaces _ but also doesn't let you repeat
            if (secretArr.includes(letter)) {
                // Make for loop, goes through each letter of secret         
                for (let i = 0; i < secretArr.length; i++) {


                    // If the letter is at the index of the word's list
                    if (secretArr[i] == letter) {


                        // If the letter has not already been used/thought of, it will replace - with letter
                        if (blankArr[i].includes(letter) != true) {
                            blankArr[i] = secretArr[i]


                            // If it is used, it says already guessed
                        } else {
                            alert("ALREADY GUESSED")
                        }



                    }
                }


                // If entire word is right, you win, places img, allows you to reload, shows button
                if (blankArr.join("") == secret) {
                    console.log("YOU WON!")
                    console.log(score)
                    let name = prompt("Enter name: ")
                    let highscore_result = document.querySelector("#highscore")
                    let top_score = document.querySelector("#score")
                    let current_score = document.querySelector("#current_score");
                    if (score < highscore['score']) {
                        let update = await updateScore(name, score)
                    }
                    console.log(name)
                    highscore = await getScore()
                    console.log(highscore)

                    // Tags + puts highscore to website


                    highscore_result.innerHTML = "Highest scorer: " + JSON.stringify(highscore['name']).replace('"', '').replace('"', '')
                    top_score.innerHTML = "Lowest number of incorrect letters: " + JSON.stringify(highscore['score'])
                    current_score.innerHTML = "Number of wrong guesses: " + score;
                    // Variables + makes buttons visible
                    let img = document.querySelector("#img")
                    img.src = "http://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/d1e16859c09183b.png"
                    buttonEl.style.display = "block"
                    window.addEventListener('keyup', (event) => {


                        // If space is clicked, it reloads, but only after the game ends
                        if (event.key == " ") {
                            location.reload()
                        }
                    });


                    // Doesn't let you add more letters or keep guessing after winning
                    document.getElementById("letter").disabled = true;

                }


                // Gets rid of the , from array
                output.innerHTML = blankArr.join(" ")



                // If letter wasn't in the word
            } else {


                // Checks if a string + only if the wrong letter hasn't already been guessed. No doubles
                if (incorrect.includes(letter) != true) {
                    if (/^[a-zA-Z]+$/.test(letter)) {

                        score = score + 1;
                        // Changes picture
                        imageIndex++
                        let img = document.querySelector("#img")
                        img.src = "assets/images/hangman" + imageIndex + ".png";


                        // If 7 wrong, button shows up, answer shows up, space can now reload page, and losing img appears
                        if (imageIndex >= 7) {
                            img.src = "http://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/8d3202a41dfe82e.png"
                            buttonEl.style.display = "block"
                            window.addEventListener('keyup', (event) => {

                                // If space is clicked, it reloads the page after game is done
                                if (event.key == " ") {
                                    location.reload()
                                }
                            });


                            // No longer can guess letters
                            document.getElementById("letter").disabled = true;


                            // Shows what the word was
                            word.style.display = "block";
                            word.innerHTML = "Word was " + secret;

                        }


                        // If letter is wrong, it writes what letter is wrong under the input box
                        incorrect.push(letter)

                        wrong.innerHTML = "Wrong: " + incorrect.join(" ")


                        // If you put something other than a letter, it tells you
                    } else {
                        alert("NOT A LETTER");
                    }


                    // If you already guessed a letter, it won't let you repeat
                } else {
                    alert("ALREADY GUESSED")
                }

            }


            // Automatically clears input box after clicking enter
            letterElem.value = ""
        }
    })

}


// Gets the list of words from another website
async function getRandomWord() {
    const wordsgit = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt")
    const wordsTxt = await wordsgit.text()
    const wordsList = wordsTxt.split("\n")
    console.log(wordsList);

    let filteredwords = []


    // Checks length of word
    for (let i = 0; i < wordsList.length; i++) {


        let word = wordsList[i]
        // 5-8 letter words. Only words with length 5-8 can be guessed

        if (word.length >= 5 && word.length <= 8) {
            filteredwords.push(word);
        }
    }
    // Chooses a random number and word that corresponds at number. GETS SECRET WORD
    const randomNum = Math.floor(Math.random() * filteredwords.length);
    const randomWord = filteredwords[randomNum]
    return (randomWord)
}



// Calls function
start()