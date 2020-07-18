// this part for some unknown reason doesnt work 
let body = document.querySelector("body");
body.style.transition = '0s';
body.style.opacity = '0';
body.style.transition = '1.5s';
body.style.opacity = '1';
// end of not working part, syntax is equivalent to the syntax on previous page where it works

let a = sessionStorage.getItem("first_city");
console.log(a);
let b = sessionStorage.getItem("second_city");
console.log(b);
let c = sessionStorage.getItem("third_city");
console.log(c);

let modify = document.getElementById("message");
modify.innerHTML = `congratulations on your chosen path! ${a} ${b} ${c}`;

for(let i = 1; i < 13; i++) {
    console.log(`Path number ${i}:`);
    let path = sessionStorage.getItem(`path${i}`);
    console.log(path);
    modify = document.getElementById(`path${i}`);
    modify.innerHTML = path;

    let calculation = sessionStorage.getItem(`calculation${i}`);
    console.log(calculation);
    let string_array : string[] = calculation.split(" ");
    let calc_with_plus: string = string_array[1] + " + " + string_array[2] + " + " + string_array[3] + " + " + string_array[4] + " =";

    modify = document.getElementById(`calc${i}`);
    modify.innerHTML = calc_with_plus;

    let res = sessionStorage.getItem(`res${i}`);
    console.log(res);
    modify = document.getElementById(`res${i}`);
    modify.innerHTML = res;
}

// apologies, but seems like fun to implement quadratic sort => its just 144 if statements in total 
for(let i: number = 1; i < 13; i++) {
    for(let j: number = 1; j < 12; j++) {
        let num1: number = parseInt(document.getElementById(`res${j}`).innerHTML);
        let num2: number = parseInt(document.getElementById(`res${j+1}`).innerHTML);
        if(num1 > num2) {
            // result on lower row is longer number => swap rows
            let temp_path: string = document.getElementById(`path${j}`).innerHTML;
            let temp_calc: string = document.getElementById(`calc${j}`).innerHTML;
            let temp_res: string = document.getElementById(`res${j}`).innerHTML;
            
            document.getElementById(`path${j}`).innerHTML = document.getElementById(`path${j+1}`).innerHTML;
            document.getElementById(`calc${j}`).innerHTML = document.getElementById(`calc${j+1}`).innerHTML;
            document.getElementById(`res${j}`).innerHTML = document.getElementById(`res${j+1}`).innerHTML;

            document.getElementById(`path${j+1}`).innerHTML = temp_path;
            document.getElementById(`calc${j+1}`).innerHTML = temp_calc;
            document.getElementById(`res${j+1}`).innerHTML = temp_res;
        }

    }
}


/// after sorted split path in order for the result page to have better geometry 

for(let i: number = 1; i < 13; i++) {
    let path: string = document.getElementById(`path${i}`).innerHTML;
    let array_path: string[] = path.split(" ");
    if(array_path[1] == a && array_path[2] == b && array_path[3] == c) {
        // highlight this row with different background
        document.getElementById(`path${i}`).style.backgroundColor = "#7fdbda";
        document.getElementById(`calc${i}`).style.backgroundColor = "#7fdbda";
        document.getElementById(`res${i}`).style.backgroundColor = "#7fdbda";
        modify = document.getElementById("message");
        if(i == 1) {
            modify.innerHTML = `<p>Congratulations you have won this round!</p><p> Indeed, ${path}, is the shortest flight out there!</p>`;
        } else if(i == 2) {
            modify.innerHTML = `<p>You almost got it right!</p><p> There is still one faster path.</p>`;
        } else {
            modify.innerHTML = `<p>Thank you for playing the game!</p><p> Please look at the list of unique paths sorted by total length.</p><p> Learn from what you have missed and give me one more try! :)</p>`;
        }

    }
    document.getElementById(`path${i}`).innerHTML = `
    <table>
        <td style="text-align: left; width:120px;">${array_path[0]}</td>
        <td style="text-align: left; width:120px;">${array_path[1]}</td>
        <td style="text-align: left; width:120px;">${array_path[2]}</td>
        <td style="text-align: left; width:120px;">${array_path[3]}</td>
        <td style="text-align: left; width:120px;">${array_path[4]}</td>
    </table>`;
}

function again(): void {
    window.location.href = "../shortest_path_game_intro.html";
}

function main_page(): void {
    window.location.href = "../../portal.html";
}