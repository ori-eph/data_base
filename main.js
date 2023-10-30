//-----------------------------data base----------------------:
localStorage.setItem("counter", JSON.stringify([]))
//base of data
function makeDataBase(nameOfData) {
    const dataXHR = new XMLHttpRequest();
    const url = "https://swapi.dev/api/" + nameOfData;
    dataXHR.open("GET", url);
    dataXHR.responseType = "json";
    dataXHR.onload = function () {
        try {
            if (this.readyState === 4 && this.status !== 200) {
                throw new Error(`no ${nameOfData} data base!`)
            }
            const data = this.response.results;
            let i = 1;
            for (let obj in data) {
                data[obj].id = i;
                i++;
            }
            const counter = JSON.parse(localStorage.getItem("counter"));
            counter.push({
                data: nameOfData,
                counter: i
            });
            localStorage.setItem("counter", JSON.stringify(counter))
            localStorage.setItem(nameOfData, JSON.stringify(data))
        }
        catch (e) {
            alert(e.message);
        }
    }
    dataXHR.send();
}

makeDataBase("people");
makeDataBase("films");
makeDataBase("starships");

//----------return some data from base-------------------------:

function returnDataArray(dataArrName) {
    if (localStorage.getItem(dataArrName)) {
        return JSON.parse(localStorage.getItem(dataArrName));
    }
    else {
        return false;
    }
}

// console.log(returnDataArray("people")); 
// console.log(returnDataArray("films")); 
// console.log(returnDataArray("starships")); 

function fromDataById(id, dataArrName) {
    const data = returnDataArray(dataArrName);
    if (!data) {
        return "no such data in the db!"
    }
    for (obj in data) {
        if (data[obj].id === id) {
            return data[obj];
        }
    }
    return "this id isn't in the data base";
}

// console.log(fromDataById(5, "starships"));


//-------return very specific data from base functions--------------------
function dataByProp(dataArrName, prop, value) {
    const data = returnDataArray(dataArrName);
    if (!data) {
        return "no such data in db!"
    }
    let result = data.filter((obj) => {
        return obj[prop] === value;
    })
    if (!result.length) {
        return "no data found"
    }
    return result;
}

// console.log(dataByProp("films", "director", "George Lucas"));

function haveStarShips() {
    const data = returnDataArray("people");
    if (!data) {
        return "no such data in db!"
    }
    let result = data.filter((obj) => {
        if (obj["starships"]) {
            return !obj["starships"].length;
        }
    })
    if (!result.length) {
        return "no data found"
    }
    return result;
}

// console.log(haveStarShips());


function heightBiggerOrSame(height) {
    if (typeof height !== "number") {
        return "this isn't a height!"
    }
    const data = returnDataArray("people");
    if (!data) {
        return "no such data in db!"
    }
    let result = data.filter((obj) => {
        return obj.height >= height;
    })
    if (!result.length) {
        return "no data found"
    }
    return result;
}

// console.log(heightBiggerOrSame());

function sortMovies() {
    const data = returnDataArray("films");
    if (!data) {
        return "no such data in db!"
    }
    let result = data.sort((a, b) => {
        return a.characters.length - b.characters.length;
    })
    if (!result.length) {
        return "no data found"
    }
    return result;
}

// console.log(sortMovies());


function checkTwoCon(prop1, value1, prop2, value2, dataArrName) {
    const data = returnDataArray(dataArrName);
    if (!data) {
        return "no such data in db!"
    }
    let result = data.filter((obj) => {
        if (obj[prop1] === value1 && obj[prop2] === value2) {
            return obj;
        };
    })
    if (!result.length) {
        return "no data found"
    }
    return result;
}

// console.log(checkTwoCon("eye_color", "red", "hair_color", "n/a", "people"));

// ---------------------------add to data base ---------------------
function addObjToData(dataArrName, newDataObj) {
    const data = returnDataArray(dataArrName);
    if (!data) {
        return "no such data in db!"
    }
    if (!newDataObj || typeof newDataObj !== "object") {
        return "new data is not legit";
    }
    else {
        let id = 0;
        const counter = JSON.parse(localStorage.getItem("counter"));
        for (let i = 0; i < counter.length; i++) {
            if (counter[i].data === dataArrName) {
                id = counter[i].counter;
                counter[i].counter += 1;
                localStorage.setItem("counter", JSON.stringify(counter));
            }
        }
        newDataObj.id = id;
        data.push(newDataObj);
        localStorage.setItem(dataArrName, JSON.stringify(data));
    }
}

// addObjToData("people", {name: "what", eye_color: "blue"})

// -------------------- remove from data base ----------------
function removeIdfromDataBase(id, dataArrName) {
    const data = returnDataArray(dataArrName);
    if (!data) {
        return "no such data in db!"
    }
    else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data.splice(i, 1);
                localStorage.setItem(dataArrName, JSON.stringify(data));
            }
        }
    }
}

// removeIdfromDataBase(7, "people");

// ------------------------ change info in data base ---------------------
function removeMovieFromPerson(id, filmUrl) {
    const data = returnDataArray("people");
    if (!data) {
        return "no such data in db!"
    }
    else {
        for (let obj of data) {
            if (obj.id === id) {
                const films = obj.films;
                for (let i = 0; i < films.length; i++) {
                    if (films[i] === filmUrl) {
                        films.splice(i, 1);
                        localStorage.setItem("people", JSON.stringify(data))
                        return "success, movie removed";
                    }
                }
                return "movie not found";
            }
        }
        return "id not found";
    }
}

// console.log(removeMovieFromPerson(1, "https://swapi.dev/api/films/1/"));