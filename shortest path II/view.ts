/// <reference path="animejs/index.d.ts" />
class View {
    game: Game;
    toggle_view_map: boolean = true;
    path: number = 1; // 0 => at redraw display all edges in standard mode without weight, for 1 - 6 display paths in green with weight 
    hover: number = 0; // 0 => at redraw display no hover, for hovers 5 - 16 inclusive display its edges highlighted with weight -> draw it on second higher canvas  
    phase: number = 1;
    answers: number[] = new Array(7).fill(-9);
    final_answer: number = 0;
    
    constructor(game: Game) {
        this.game = game;
        document.getElementById('text2').innerHTML = `You have now been for a week in ${game.start}. And decided that your next destination will be ${game.goal}.`;
        document.getElementById('text3').innerHTML = `Sadly, there is no direct flight from ${game.start} to ${game.goal}. 😞😲`;
        document.querySelectorAll(".ml3").forEach(function(userItem) {userItem.innerHTML = userItem.textContent.replace(/\S/g, "<span class='letter'>$&</span>");});
        anime.timeline({loop: false}).add({targets: '.ml3 .letter', opacity: [0,1], easing: "easeInOutQuad", duration: 600, delay: (el:HTMLElement, i:number) => 30 * (i+1)});
        document.getElementById("letsplay").addEventListener("mousedown", _ => this.start_playing(game));
        document.addEventListener("mousedown", ev => { console.log(`${ev.x} ${ev.y}`);});
        this.path = 1;
    }

    start_playing(game: Game): void {
        let temp: string = page_game; 
        let map = game.cities; // add pictures of stars for position of cities and their names 
        for (let [key, value] of map) {
            console.log(key, value);
            let x: number = value[0];
            let y: number = value[1];
            if(key == "Tripoli") {
                y -= 5;
            }
            temp = temp + `<img id="${key}" src="star.png" style="position: absolute; left: ${x+65-11}px; top: ${83-11+y}px; z-index: 5;">`;
            if(key == "Moscow") {
                x -= 20;
            } else if(key == "Riga") {
                y += 43;
            } else if(key == "Beirut") {
                x -= 40; y += 23;
            } else if(key == "Damascus") {
                x -= 10; y -= 4;
            }
            temp = temp + `<img id="${key}_name" src="./cities/${key}.png" style="position: absolute; left: ${x+65-11-51+11}px; top: ${83-11-19+y}px; z-index: 5000;">`;
        }

        for(let i: number = 1; i <= 11; ++i) {
            temp = temp + `<p id="tree${i}" class="tree_city">${game.flight_cities[i]}</p>`;
        }

        temp = temp + `<p id="shared_text">Sum of paths: </p> <p id="set_ans">Set answer</p>`;
        let a = game.flight_cities; let b = game.paths; 
        for(let i: number = 1; i < 7; ++i) {
            temp = temp + `<p class="sum_paths" id="path${i}">${a[b[i][0]]} &#10132 ${a[b[i][1]]} &#10132; ${a[b[i][2]]} &#10132; ${a[b[i][3]]} = </p> `;
        }
        temp = temp + `
            <input type="checkbox" id="answer1" class="answer_checkbox" value="" name="check"/>
            <input type="checkbox" id="answer2" class="answer_checkbox" value="" name="check"/>
            <input type="checkbox" id="answer3" class="answer_checkbox" value="" name="check"/>
            <input type="checkbox" id="answer4" class="answer_checkbox" value="" name="check"/>
            <input type="checkbox" id="answer5" class="answer_checkbox" value="" name="check"/>
            <input type="checkbox" id="answer6" class="answer_checkbox" value="" name="check"/>
        `;
        document.body.innerHTML = temp;

        /*>>>>>>>>>>>>>>>>>  Event listeners init   <<<<<<<<<<<<<<<<<<<<<<<<<< */
        document.getElementById("btn3").addEventListener("mousedown", ev => {this.check_answer()});
        for(let key of map.keys()) {
            // for each city on the graph of flights add eventlistener for hover and for clearing that canvas. 
            let el:HTMLElement = document.getElementById(key);
            let key_num: number = this.index_in_perm(key);
            
            el.addEventListener("mouseover", ev => { 
                this.hover = key_num; 
                this.redraw(); 
            } );

            el.addEventListener("mouseout", ev => { 
                this.hover = 0;
                this.redraw(); 
            } );
        }

        document.addEventListener("mouseup", ev => { 
            let city = this.clicked_onto_star(ev.x, ev.y);
            if(city != "false") {
                let key_num: number = this.index_in_perm(city);
                let path_num: number = this.index_of_path(key_num);
                if(this.path == 0 && path_num != -99) {
                    this.path = path_num;
                } else {
                    this.path = 0;
                }
            }
            this.redraw();
        } );

        document.addEventListener("keydown", ev => {
            if(ev.key == "0" || ev.key == "1" || ev.key == "2" || ev.key == "3" || ev.key == "4" || ev.key == "5" || ev.key == "6") {
                if( !(document.activeElement === document.getElementById('answer_user2')) ) {
                    this.path = parseInt(ev.key); 
                    this.redraw();
                }
            } else if (ev.key == "Enter") {
                console.log("pressed enter");
                this.check_answer();
            } else {
                console.log(ev.key);
            }
        });

        for(let i: number = 1; i < 7; ++i) {
            document.getElementById(`answer${i}`).addEventListener("mousedown", ev => { this.correct_checkbox(i); });
        }

        this.redraw();
    }

    correct_checkbox(i: number): void {
        this.final_answer = i;
        for(let j: number = 1; j < 7; ++j) {
            let el: HTMLInputElement = <HTMLInputElement>(document.getElementById(`answer${j}`));
            if(el.checked) {
                if(i != j) {
                    el.checked = false;
                } else {
                    el.checked = true;
                }
            }     
        }
    }

    check_answer(): void {
        let path: number = -9;
        if(this.phase != 7) {
            let sum: number = -9;
            let box: HTMLInputElement = <HTMLInputElement>(document.getElementById("answer_user2"));
            let answer: string = box.value;
            sum = parseInt(answer);
            console.log("user answer: " + sum);
            let dist: number = this.current_distance()
            if(dist == sum) {
                console.log("user answer correct");
                this.answers[this.phase] = dist;
                this.phase += 1;
                this.path += 1;
                (<HTMLInputElement>(document.getElementById("answer_user2"))).value = "";
                this.redraw();
            } else {
                console.log("user is fail, correct is: " + dist);
                this.animate_fail();
            }
        } else {
            this.toggle_view(false);
            this.redraw();
            if(this.final_answer != 0) {
                this.evaluate_answer(this.final_answer, this.answers[this.final_answer]);
            }
        }
    }

    animate_fail(): void {
        let el: HTMLElement = document.getElementById("btn3");
        let fail_emotions: string[] = ["🤨", "😬", "🙄", "😒", "🤯", "🙈"];
        el.innerHTML = fail_emotions[game.randint(0,5)] + fail_emotions[game.randint(0,5)];
        el.id = "btn3_fail";
        setTimeout(this.animate_reverse, 1500);
    }

    animate_reverse(): void {
        let el: HTMLElement = document.getElementById("btn3_fail");
        el.id = "btn3";
        el.innerHTML = "Check answer";
    }

    current_distance(): number {
        let total_dist: number = 0;
        for(let i: number = 0; i < 3; ++i) {
            let [fx, fy]: [number, number] = game.cities.get(game.flight_cities[(game.paths[this.phase][i])]), [tx, ty]: [number, number] = game.cities.get(game.flight_cities[(game.paths[this.phase][i+1])]);
            let dist: number = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
            dist = Math.round(dist / 10);
            total_dist += dist;
        }
        return total_dist;
    }

    toggle_view(satelite_map: boolean) {
        let canvas: number = 1;
        let stars: number = 5;
        let names: number = 5000;
        let sat_opacity: number = 1;
        let tree_names: number = -2;
        let tree_memory: number = -2;
        if(!satelite_map) {
            stars = names = -2;
            sat_opacity = 0.08;
            tree_names = 11;
            tree_memory = 2;
        }
        document.getElementById("canvas").style.zIndex = `${canvas}`;
        document.getElementById("europe_sat").style.opacity = `${sat_opacity}`;
        document.getElementById("shared_text").style.zIndex = `${tree_memory}`;
        document.getElementById("set_ans").style.zIndex = `${tree_memory}`;
        for(let key of game.cities.keys()) {
            document.getElementById(key).style.zIndex = `${stars}`;
            document.getElementById(`${key}_name`).style.zIndex = `${names}`;
        }
        for(let i: number = 1; i <= 11; ++i) {
            document.getElementById(`tree${i}`).style.zIndex = `${tree_names}`;
        }
        for(let i:number = 1; i < 7; ++i) {
            document.getElementById(`path${i}`).style.zIndex = `${tree_memory}`;
            document.getElementById(`answer${i}`).style.zIndex = `${tree_memory}`;
        }
        this.toggle_view_map = satelite_map;
        this.redraw();
    }   

    clicked_onto_star(x: number, y: number): string {
        // check if click is inside any of star pngs. for first occurence return true, otherwise false 
        for (let [key, value] of game.cities) {
            let x_min: number = value[0] +65-11;
            let y_min: number = value[1] +83-11;
            let x_max = x_min + 21;
            let y_max = y_min + 21;
            if(x >= x_min && x <= x_max && y >= y_min && y <= y_max) {
                return key;
            }
        }
        return "false";
    }

    index_of_path(graph_index: number ): number {
        for(let i: number = 1; i < game.paths.length; ++i) {
            for(let j of game.paths[i]) {
                if(j == graph_index) {
                    return i;
                }
            }
        } console.log("fatal error at index_of_path"); return -99; // kill the run
    }

    index_in_perm(city: string): number {
        for(let i:number = 0; i < game.flight_cities.length; ++i) {
            if(city == game.flight_cities[i]) {
                return i;
            }
        } console.log("fatal error at index_in_perm"); return -99; // kill the run
    }

    redraw() {
        if(game.game_over) 
            return;
        function toggleZoomScreen(scale_percent: number) {
            document.body.style.zoom = `${scale_percent}%`;
        }
        let browser_width: number = window.innerWidth;
        let percentage_change: number = (browser_width / 1920) * 100;
        toggleZoomScreen(percentage_change);

        let canvas = <HTMLCanvasElement>document.getElementById("canvas"); 
        canvas.width = 1274; canvas.height = 772;
        let cx: CanvasRenderingContext2D = canvas.getContext('2d');
        cx.clearRect(0, 0, 1274, 772);
        cx.fillStyle = 'rgba(0, 0, 0, 1)';
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        cx.font = ' 22px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';

        for (let key of game.cities.keys()) 
            (<HTMLImageElement>(document.getElementById(key))).src = "./star.png"; 
        
        if(this.phase != 7) {
            let temp: string = game.flight_cities[game.paths[this.phase][0]];
            for(let i: number = 1; i < 4; ++i) {
                temp += ` ⟹ ${game.flight_cities[game.paths[this.phase][i]]}`;
            }
            document.getElementById("answer_user1").innerHTML = temp;
        }

        if(this.toggle_view_map) {
            this.draw_paths(cx);
        } else {
            this.draw_tree(cx);
        }
    }

    draw_tree(cx: CanvasRenderingContext2D) {
        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                let [fx, fy] = game.cities.get(game.flight_cities[from]), [tx, ty] = game.cities.get(game.flight_cities[toX]);
                cx.beginPath();
                cx.lineWidth = 2;
                let fx_tree: number = document.getElementById(`tree${from}`).offsetLeft + 120 - 65; 
                let fy_tree: number = document.getElementById(`tree${from}`).offsetTop + 15 - 83;
                let tx_tree: number = document.getElementById(`tree${toX}`).offsetLeft + 0 - 65;
                let ty_tree: number = document.getElementById(`tree${toX}`).offsetTop + 15 - 83;                 
                cx.moveTo(fx_tree, fy_tree);
                cx.lineTo(tx_tree, ty_tree);
                cx.strokeStyle = 'rgba(0, 255, 0, 1)';
                cx.stroke();

                /* stroke edge doesnt work in this case */
                let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
                dist = Math.round(dist / 10);
                let [mid_x, mid_y] = [(fx_tree + tx_tree) / 2, (fy_tree + ty_tree) / 2];
                cx.beginPath();
                cx.arc(mid_x, mid_y, 23, 0, 2 * Math.PI);
                cx.fillStyle = 'rgba(20, 20, 20,1)'; 
                cx.fill();                                      // fill background of circle
                cx.strokeStyle = 'rgba(0, 255, 0, 0.95)';
                cx.stroke();
                cx.fillStyle = 'rgba(0, 255, 0, 1)';
                cx.strokeStyle = 'rgba(0, 255, 0, 1)';  // 'rgba(255, 202, 24, 0.9)';
                cx.fillText(dist.toString(), mid_x, mid_y);
                cx.lineWidth = 1;
                cx.strokeText(dist.toString(), mid_x, mid_y);  // print distance onto circle 
            }
        }
        let a = game.flight_cities; let b = game.paths; 
        for(let i: number = 1; i < 7; ++i) {
            let el: HTMLElement = document.getElementById(`path${i}`);
            el.innerHTML = `${a[b[i][0]]} &#10132 ${a[b[i][1]]} &#10132; ${a[b[i][2]]} &#10132; ${a[b[i][3]]} = ${this.answers[i]}`;
        }
        document.getElementById("answer_text").innerHTML = "The shortest combination of flights is:";
        document.getElementById("answer_text2").innerHTML = "with total distance:";
        document.getElementById("answer_user1").innerHTML = "";
        document.getElementById("answer_user2").style.zIndex = "-9999";

        for(let i: number = 1; i < 7; ++i) {
            let el: HTMLInputElement = <HTMLInputElement>(document.getElementById(`answer${i}`));
            if(this.final_answer == i)  {
                document.getElementById("answer_user1").innerHTML = `${a[b[i][0]]} &#10132 ${a[b[i][1]]} &#10132; ${a[b[i][2]]} &#10132; ${a[b[i][3]]}`;
                document.getElementById("answer_user3").innerHTML = `${this.answers[i]}`;
            }
        }
    }

    draw_paths(cx: CanvasRenderingContext2D) {
        if(this.path == 0) {
            this.draw_all(cx);
        } else {
            this.draw_path(this.path, cx);
        }
        this.connect_start_goal(cx);
        this.draw_hover(cx);
    }

    stroke_edge(cx: CanvasRenderingContext2D, [fx, fy]: [number, number], [tx, ty]: [number, number], rgba: string, enumerate_distance: boolean): void {
        cx.beginPath();
        cx.lineWidth = 2;
        cx.moveTo(fx, fy);
        cx.lineTo(tx, ty);
        cx.strokeStyle = rgba;
        cx.stroke();
        if(enumerate_distance) {
            let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
            dist = Math.round(dist / 10);
            let [mid_x, mid_y] = [(fx + tx) / 2, (fy + ty) / 2];
            cx.beginPath();
            cx.arc(mid_x, mid_y, 22, 0, 2 * Math.PI);
            cx.fillStyle = 'rgba(20, 20, 20,1)'; 
            cx.fill();                                      // fill background of circle
            cx.strokeStyle = 'rgba(0, 255, 0, 0.95)';
            cx.stroke();
            cx.fillStyle = 'rgba(0, 255, 0, 1)';
            cx.strokeStyle = 'rgba(0, 255, 0, 1)';  // 'rgba(255, 202, 24, 0.9)';
            cx.fillText(dist.toString(), mid_x, mid_y);
            cx.lineWidth = 1;
            cx.strokeText(dist.toString(), mid_x, mid_y);  // print distance onto circle 
        }
    }

    draw_path(path: number, cx: CanvasRenderingContext2D): void {
        if(path == 7) path = 6;
        for(let i: number = 0; i < 3; ++i) {
            let from: string = game.flight_cities[game.paths[path][i]];
            let to: string = game.flight_cities[game.paths[path][i+1]];
            this.stroke_edge(cx, game.cities.get(from), game.cities.get(to), 'rgba(0, 255, 0, 1)', true);
            (<HTMLImageElement>(document.getElementById(from))).src = "./star_green.png"; 
            (<HTMLImageElement>(document.getElementById(to))).src = "./star_green.png";
        }
    }   

    draw_all(cx: CanvasRenderingContext2D) {        
        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                this.stroke_edge(cx, game.cities.get(game.flight_cities[from]), game.cities.get(game.flight_cities[toX]), 'rgba(155, 223, 244, 0.9)',false);
            }
        }
    }

    connect_start_goal(cx: CanvasRenderingContext2D) { // cx: CanvasRenderingContext2D
        let [fx, fy] = game.cities.get(game.start) , [tx, ty] = game.cities.get(game.goal);
        cx.beginPath();
        cx.lineWidth = 3;
        cx.strokeStyle = 'rgba(0,255,0,1)';
        cx.setLineDash([6, 8]);
        cx.moveTo(fx, fy);
        cx.lineTo(tx, ty);
        cx.stroke();
        cx.setLineDash([]);
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
    }

    draw_hover(cx: CanvasRenderingContext2D): void {
        if(this.hover == 0) {
            return;
        }
        let city: string = game.flight_cities[this.hover];
        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                if(game.flight_cities[toX] == city || game.flight_cities[from] == city ) {
                    this.stroke_edge(cx, game.cities.get(game.flight_cities[from]), game.cities.get(game.flight_cities[toX]), 'rgba(0, 255, 0, 1)', true);
                    (<HTMLImageElement>(document.getElementById(game.flight_cities[from]))).src = "./star_green.png";
                    (<HTMLImageElement>(document.getElementById(game.flight_cities[toX]))).src = "./star_green.png";
                }
            }
        }
    }

    evaluate_answer(path: number, sum: number) { 
        document.body.innerHTML = page_summary;
        document.getElementById("return").addEventListener("mousedown", function() { window.location.href = "../portal.html"; });
        document.getElementById("play_again").addEventListener("mousedown", function() { window.location.reload(); });
    
        let ret:string[][] = game.evaluate_answer_g(path, sum);

        for(let i: number = 1; i < 7; i++) {
            let split_path: string[] = ret[i][0].split("+");
            document.getElementById(`p${i}`).innerHTML = `
                <table style="width:100%;"><td style="text-align: center; width:120px;">${split_path[0]}</td>
                <td style="text-align: center; width:120px;">${split_path[1]}</td>
                <td style="text-align: center; width:120px;">${split_path[2]}</td>
                <td style="text-align: center; width:120px;">${split_path[3]}</td></table>`;
            
            document.getElementById(`calc${i}`).innerHTML = `${ret[i][1]}`;
            document.getElementById(`res${i}`).innerHTML = `${ret[i][2]}`;
            document.getElementById(`calc${i}`).style.textAlign = "center";
            document.getElementById(`res${i}`).style.textAlign = "left";
        }

        let row: number = game.players_path_order;
        let rows: number[] = [/*dummy*/-9, 200,239,277,313,350,388];
        document.getElementById("highlight_users_path").style.top = `${rows[row]}px`;

        let audio = new Audio('./loss.mp3');
        let el:HTMLElement = document.getElementById("motivate");
        let emojis: string[] = ["🔥", "👍", "👌", "👏", "🤗", "💪", "🎉", "✌", "✨", "🙌"];
        let a: string[] = [emojis[game.randint(0,9)], emojis[game.randint(0,9)], emojis[game.randint(0,9)], emojis[game.randint(0,9)]];
        if(game.answer_path && game.answer_sum) {
            audio = new Audio('./victory.mp3');
            el.innerHTML = ` Congratulations! ${a[0]}${a[1]}${a[2]}${a[3]} You have answered both the path and its sum correctly. `;
        } else if(game.answer_path && !game.answer_sum) {
            el.innerHTML = `You have chosen the cheapest path correctly ${a[2]}, but didn't get the price right. It's not ${game.answer_sum_in}. The sum is ${document.getElementById(`res${row}`).innerHTML}.`;
        } else if(!game.answer_path && game.answer_sum) {
            el.innerHTML = `You have calculated the price of the path you chose well ${a[1]}, but there is a cheaper path!`;
        }
        audio.play();
    }
}

/* ------------- run: ------------ */
let game: Game = new Game();
let view: View = new View(game);