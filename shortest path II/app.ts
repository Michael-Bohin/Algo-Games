class Game {
    public cities: Map<string, [number,number]> = new Map<string, [number, number]>([
        ["Reykjavik",  [67,   135]], ["Dublin",     [381,  356]], ["London",     [516,  391]], ["Amsterdam",  [602,  371]],
        ["Oslo",       [721,  230]], ["Copenhagen", [753,  312]], ["Berlin",     [761,  368]], ["Stockholm",  [871,  238]],
        ["Warszaw",    [927,  377]], ["Helsinki",   [1007, 218]], ["Riga",       [999,  236]], ["Moscow",     [1259, 308]],
        ["Kiev",       [1115, 415]], ["Budapest",   [884,  477]], ["Prague",     [793,  426]], ["Zurich",     [683,  470]], 
        ["Lisbon",     [320,  650]], ["Rabat",      [367,  746]], ["Madrid",     [423,  607]], ["Algiers",    [576,  685]],
        ["Tunis",      [716,  684]], ["Tripoli",    [765,  765]], ["Rome",       [753,  587]], ["Paris",      [548,  447]],
        ["Bucharest",  [1049, 542]], ["Sofia",      [1019, 581]], ["Istanbul",   [1091, 600]], ["Athens",     [984,  668]],
        ["Beirut",     [1216, 748]], ["Damascus",   [1241, 755]]
    ]);

    choose_dest: string[][] = [ 
        ['Reykjavik', 'Beirut'], ['Dublin', 'Istanbul'], ['Oslo', 'Tripoli'], ['Lisbon', 'Helsinki'], 
        ['Kiev', 'Rabat'], ['Lisbon', 'Kiev'],['Athens', 'Oslo'], ['Bucharest', 'Dublin'],
        ['Moscow', 'Reykjavik'], ['Moscow', 'Lisbon'], ['Tripoli', 'Copenhagen'], ['Dublin', 'Riga'], 
        ['Rabat', 'Stockholm'], ['Rome', 'Stockholm']
    ];

    public graph: Map<number, number[]> = new Map<number,number[]>([
        [1, [2, 3, 4]],
        [2, [5, 6]], [3, [7, 8]], [4, [9, 10]],
        [5, [11]], [6, [12]], [7, [13]], [8, [14]], [9, [15]], [10, [16]],
        [11, [17]], [12, [17]], [13, [17]], [14, [17]], [15, [17]], [16, [17]]
    ]); 

    public paths: number[][] = [
        [-9],   // dummy 
        [1, 2, 5, 11, 17],
        [1, 2, 6, 12, 17],
        [1, 3, 7, 13, 17],
        [1, 3, 8, 14, 17],
        [1, 4, 9, 15, 17],
        [1, 4, 10, 16, 17]
    ]

    public start: string;
    public goal: string;
    public flight_cities: string[];
    public answer_path: boolean = false;    // did the player answer correct path? 
    public answer_sum: boolean = false;     // did the player calc the sum of path correctly? 
    public answer_path_in: number;          // which path did the player point at 
    public answer_sum_in: number;           // what did the player calculate
    public players_path_order: number;      // position of players path in sorted list 
    public game_over: boolean = false;      // in order to prevent redraw firing eventlisteners at game summary stage meant for playing stage

    constructor() {
        let choice = this.randint(0, 13);
        this.start = this.choose_dest[choice][0];
        this.goal = this.choose_dest[choice][1];
        if(Math.random() > 0.5) {
            let temp = this.start;
            this.start = this.goal;
            this.goal = temp;
        } 
        let rand_perm: string[] = new Array(30);
        let i: number = 0;
        for(let c of this.cities.keys()) {
            rand_perm[i] = c; i += 1;
        }
        this.flight_cities = this.randperm(rand_perm);
    }
    
    public randint(min: number, max: number): number { // inclusive type of both min and max
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    randperm(arr: string[]): string[] {
        let ret: string[] = new Array(arr.length);
        for(let i: number = 0; i < arr.length; ++i) {
            let rand:number = this.randint(i, arr.length - 1);
            let temp: string = arr[rand];
            arr[rand] = arr[i];
            arr[i] = temp;
        }

        for(let i: number = 0; i < arr.length; ++ i) {
            if(arr[i] == this.start) { // swap with element at index 1
                arr[i] = arr[1];
                arr[1] = this.start;
            }
            if(arr[i] == this.goal) { // swap with element at index 1
                arr[i] = arr[17];
                arr[17] = this.goal;
            }
        }

        for(let i: number = 0; i < arr.length; ++ i) {
            ret[i] = arr[i];
        }
        return ret;        
    }

    public evaluate_answer_g(path: number, distance: number): string[][]  {
        // output: string[] flights paths, string[] addition, string[] sums (ready for DOM) and save to attribute if user answered correctly both path and sum 
        // => string[][] answer_matrix 0 - flight paths 1 - addition with sum 2 - sum in string 
        let ret: string[][] = new Array(7); // include dummy 
        let int_sum: number[] = new Array(7);
        for(let i: number = 0; i < 7; ++i) { ret[i] = new Array(3); }

        for(let i: number = 1; i < 7; ++i) { /* value inits from undefined >>> */ ret[i][0] = ""; ret[i][1] = ""; int_sum[i] = 0;
            for(let j: number = 0; j < 5; ++j) {
                if(j != 0) {
                    ret[i][0] += " + ";
                    let [fx, fy] = game.cities.get(game.flight_cities[game.paths[i][j-1]]), [tx, ty] = game.cities.get(game.flight_cities[game.paths[i][j]]);
                    let dist: number = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
                    dist = Math.round(dist / 10);
                    if(j != 1) 
                        ret[i][1] += " + ";
                    ret[i][1] += `${dist}`;
                    int_sum[i] += dist;
                }
                ret[i][0] += `${this.flight_cities[this.paths[i][j]]}`;
            }
            ret[i][1] += ' =';
            ret[i][2] = `${int_sum[i]}`;
        }

        /// into morning: 
        // 1. save which path is the answer and whether player has answered its sum correctly 
        this.answer_path_in = path;
        this.answer_sum_in = distance;
        if(int_sum[path] == distance) // correct sum answer 
            this.answer_sum = true;    
        // 2. sort the paths by distance
        // here it gets tricky because I want to return sorted list of paths for the view class to display that, 
        // but at the same time I need to remember which of the sorted paths is the path user pointed at as the shortest 
        // could do it with temp_sum field but once in a lot of distributions some paths will have same sum => making eval incorect in 50% of time 
        // => create copy, sort original and look where did the answered path go (no need to save int_sum so Ill just sort that)
        let copy: string[][] = new Array(7);
        for(let i: number = 0; i < 7; ++i) {
            copy[i] = new Array(3);
            for(let j: number = 0; j < 3; ++j) {
                copy[i][j] = ret[i][j];
            }
        }
        // sort ret and temp int sum: // quadratic sort - 30 iterations
        for(let i: number = 1; i < 7; i++) {
            for(let j: number = 1; j < 6; j++) {
                if(int_sum[j] > int_sum[j+1]) { // rows need to be swapped
                    let temp_ret: string[] = ret[j];
                    let temp_sum: number = int_sum[j];
                    ret[j] = ret[j+1];
                    int_sum[j] = int_sum[j+1];
                    ret[j+1] = temp_ret;
                    int_sum[j+1] = temp_sum;
                }
            }
        }
        // 3. look whether user has picked the correct path, save position of the path user picked to public attribute
        for(let i: number = 1; i < 7; ++i) {
            // is ret of i equal to copy of path ? if so user picked this path in sorted array of paths 
            if(ret[i][0] == copy[path][0]) {
                this.players_path_order = i;
                if(i == 1)
                    this.answer_path = true;
            }
        }
        this.game_over = true;
        return ret;
    }
}

class View {
    game: Game;
    toggle_view_map: boolean = true;
    path: number = 0 // 0 => at redraw display all edges in standard mode without weight, for 1 - 6 display paths in green with weight 
    hover: number = 0 // 0 => at redraw display no hover, for hovers 5 - 16 inclusive display its edges highlighted with weight -> draw it on second higher canvas  

    constructor(game: Game) {
        this.game = game;
        document.getElementById('text2').innerHTML = `You have now been for a week in ${game.start}. And decided that your next destination will be ${game.goal}.`;
        document.getElementById('text3').innerHTML = `Sadly, there is no direct flight from ${game.start} to ${game.goal}. 😞😲`;
        document.querySelectorAll(".ml3").forEach(function(userItem) {userItem.innerHTML = userItem.textContent.replace(/\S/g, "<span class='letter'>$&</span>");});
        anime.timeline({loop: false}).add({targets: '.ml3 .letter', opacity: [0,1], easing: "easeInOutQuad", duration: 600, delay: (el:HTMLElement, i:number) => 30 * (i+1)});
        document.getElementById("letsplay").addEventListener("mousedown", _ => this.start_playing(game));
        //document.addEventListener("mousedown", ev => { console.log(`Mouse clicked at ${ev.x}, ${ev.y}`);});
    }

    start_playing(game: Game): void {
        var visualViewport = window.visualViewport;
        console.log(window.visualViewport);
        var scale = visualViewport.scale;
        console.log(scale);

        let temp: string = `
            <img src="nasa europe.jpg" id="europe_sat">  
            <canvas id="canvas"></canvas>
            <canvas id="canvas_hover"></canvas>
            <div id="herni_tabule"></div>
            <div id="answer_tab"></div>
            <p id="toggle_text">View</p>
            <div id="btn1" class="button ice toggle">Satelite map</div> 
            <div id="btn2" class="button ice toggle">Flight graph</div> 
            <p id="answer_text">The cheapest combination of flights is:</p> 
            <p id="answer_text2">with the total cost:</p> 
            <p id="answer_user1"></p>
            <p id="answer_user2"></p>
            <div id="btn3" class="button ice toggle">Check answer</div> 
            <div id="map_elements"></div>  
            <div id="tree_elements"></div>
        `;  // the last two elements will hold map and tree elements and on changing view mode are going to be used for their destruction before drawing the other mode 
        
        // add pictures of stars for position of cities and their names 
        let map = game.cities;
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

        for(let i: number = 1; i <= 17; ++i) {
            temp = temp + `<p id="tree${i}" class="tree_city">${game.flight_cities[i]}</p>`;
        }

        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                temp = temp + `<input type="number" id="tree_memory${from}-${toX}" class="tree_memory" min="0" max="1000" value="" placeholder="?" step="1">`;
            }
        }

        temp = temp + `<p id="shared_text">Sum of paths: </p> <p id="set_ans">Set answer</p>`;
        let a = game.flight_cities; let b = game.paths; 
        for(let i: number = 1; i < 7; ++i) {
            temp = temp + `<p class="sum_paths" id="path${i}">${a[b[i][0]]} &#10132 ${a[b[i][1]]} &#10132; ${a[b[i][2]]} &#10132; ${a[b[i][3]]} &#10132; ${a[b[i][4]]} = <input type="number" id="sum${i}" class="sum_input" min="0" max="1000" value="" placeholder="?" step="1"> </p> `;
        }
        /*onclick="onlyOne(this)"*/
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

        document.addEventListener("mousedown", ev => { 
            let city = this.clicked_onto_star(ev.x, ev.y);
            if(city != "false") {
                let key_num: number = this.index_in_perm(city);
                let path_num: number = this.index_of_path(key_num);
                if(this.path == 0 && path_num != -99) {
                    this.path = path_num;
                } else {
                    this.path = 0;
                }
            } else {
                if(this.path != 0) {
                    this.path = 0;
                }
            }
            this.redraw();
        } );

        document.addEventListener("keyup", this.update_answer_sum );
       //document.addEventListener("mouseup", this.update_answer_sum );
        document.getElementById("btn1").addEventListener("mousedown", ev => { this.toggle_view(true); });
        document.getElementById("btn2").addEventListener("mousedown", ev => { this.toggle_view(false); });
        document.getElementById("btn3").addEventListener("mousedown", ev => {
            let path: number;
            let sum: number = -9;
            for(let i: number = 1; i < 7; ++i) {
                let el: HTMLInputElement = <HTMLInputElement>(document.getElementById(`answer${i}`));
                if(el.checked) {
                    let box: HTMLInputElement = <HTMLInputElement>(document.getElementById(`sum${i}`));
                    let answer: string = box.value;
                    sum = parseInt(answer);
                    path = i;
                }
            }
            if (typeof(path) == 'undefined') {
                // do nothing user didnt pick any checkbox at this point in time 
            } else {
                console.log(`path: ${path}, sum: ${sum}`);
                this.evaluate_answer(path, sum);
            }
        });

        document.addEventListener("keydown", ev => {
            if(ev.key == "s" || ev.key == "S") {
                this.toggle_view(true);
            } else if(ev.key == "f" || ev.key == "F") {
                this.toggle_view(false);
            }  else if(ev.key == "0" || ev.key == "1" || ev.key == "2" || ev.key == "3" || ev.key == "4" || ev.key == "5" || ev.key == "6") {
                this.path = parseInt(ev.key); this.redraw();
            } else {
                console.log(ev.key);
            }
        });

        for(let i: number = 1; i < 7; ++i) {
            document.getElementById(`answer${i}`).addEventListener("mousedown", ev => { this.update_answer_path(i); });
        }

        this.redraw();
    }

    update_answer_sum(): void {
        if(game.game_over)
            return;
        for(let i: number = 1; i < 7; ++i) {
            let el: HTMLInputElement = <HTMLInputElement>(document.getElementById(`answer${i}`));
            if(el.checked) {
                let box: HTMLInputElement = <HTMLInputElement>(document.getElementById(`sum${i}`));
                let answer: string = box.value;
                document.getElementById("answer_user2").innerHTML = `${answer}`;
            }
        }
    }

    update_answer_path(i: number): void {
        for(let j: number = 1; j < 7; ++j)
            if(i != j) {
                let el: HTMLInputElement = <HTMLInputElement> document.getElementById(`answer${j}`);
                el.checked = false;
            }
        let a = game.flight_cities; let b = game.paths; 
        document.getElementById("answer_user1").innerHTML = `${a[b[i][0]]} &#10132 ${a[b[i][1]]} &#10132; ${a[b[i][2]]} &#10132; ${a[b[i][3]]} &#10132; ${a[b[i][4]]}`;
        
        let box: HTMLInputElement = <HTMLInputElement>(document.getElementById(`sum${i}`));
        let answer: string = box.value;
        document.getElementById("answer_user2").innerHTML = `${answer}`;
    }

    toggle_view(satelite_map: boolean) {
        // if satelite_map, set the following z indexes: 
        // canvas = 1, canvas_hover = 5, all ids from cities = 5, all ids from cities_name = 5000; 
        // tree = -1
        // otherwise tree = 10; and the the other go to -2
        // also add key_tree_dist and key_tree_name into the foreach and id loop 
        let canvas: number = 1;
        let canvas_hover: number = 1;
        let stars: number = 5;
        let names: number = 5000;
        let sat_opacity: number = 1;
        let tree_names: number = -2;
        let tree_memory: number = -2;

        if(!satelite_map) {
            canvas_hover = stars = names = -2;
            sat_opacity = 0.08;
            tree_names = 11;
            tree_memory = 2;
        }
        document.getElementById("canvas").style.zIndex = `${canvas}`;
        document.getElementById("canvas_hover").style.zIndex = `${canvas_hover}`;
        document.getElementById("europe_sat").style.opacity = `${sat_opacity}`;
        for(let key of game.cities.keys()) {
            document.getElementById(key).style.zIndex = `${stars}`;
            document.getElementById(`${key}_name`).style.zIndex = `${names}`;
        }

        for(let i: number = 1; i <= 17; ++i) {
            document.getElementById(`tree${i}`).style.zIndex = `${tree_names}`;
        }

        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                document.getElementById(`tree_memory${from}-${toX}`).style.zIndex = `${tree_memory}`;
            }
        }

        for(let i:number = 1; i < 7; ++i) {
            document.getElementById(`path${i}`).style.zIndex = `${tree_memory}`;
            document.getElementById(`answer${i}`).style.zIndex = `${tree_memory}`;
        }

        document.getElementById("shared_text").style.zIndex = `${tree_memory}`;
        document.getElementById("set_ans").style.zIndex = `${tree_memory}`;

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
        console.log(browser_width);
        console.log(window.innerHeight);
        console.log(percentage_change);
        toggleZoomScreen(percentage_change);
        console.log(`width after change: ${window.innerWidth}`);
        console.log(`height after change: ${window.innerHeight}`);

        let wtf = document.querySelectorAll("canvas");
        let canvas_h = wtf[1]; let canvas = wtf[0];
        canvas_h.width = canvas.width = 1274; canvas_h.height = canvas.height = 772;
        let cx = canvas.getContext('2d');
        let cx2 = canvas_h.getContext('2d');

        this.clear(cx, cx2);
        if(this.toggle_view_map) {
            this.draw_paths(cx);
            this.draw_hover(cx2);
        } else {
            this.draw_tree(cx);
        }
    }

    draw_tree(cx: CanvasRenderingContext2D) {
        // difference of logic : keep displaying original distance but paint the edge from new start to new dest 
        // to is 15 pixels beneath top left corner of city name, from is 15 pixels lower and 120 pixels to the right 
        // => { to: top += 15px; from: top: +=15px, left:  += 120px; }
        cx.fillStyle = 'rgba(0, 0, 0, 1)';
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        cx.font = ' 22px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';

        
        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                let [fx, fy] = game.cities.get(game.flight_cities[from]), [tx, ty] = game.cities.get(game.flight_cities[toX]);
                cx.beginPath();
                cx.lineWidth = 2;
                let fx_tree: number = document.getElementById(`tree${from}`).offsetLeft + 120 - 65; // lol # 0 equality, 0 is a number too 
                let fy_tree: number = document.getElementById(`tree${from}`).offsetTop + 15 - 83;
                let tx_tree: number = document.getElementById(`tree${toX}`).offsetLeft + 0 - 65;
                let ty_tree: number = document.getElementById(`tree${toX}`).offsetTop + 15 - 83;                 
                cx.moveTo(fx_tree, fy_tree);
                cx.lineTo(tx_tree, ty_tree);
                cx.strokeStyle = 'rgba(0, 255, 0, 1)';
                cx.stroke();

                let dist = Math.sqrt((fx - tx) ** 2 + (fy - ty) ** 2);
                dist = Math.round(dist / 10);
                let [mid_x, mid_y] = [(fx_tree + tx_tree) / 2, (fy_tree + ty_tree) / 2];
                /* >>>>> modify position of box that is over it */ 
                let el: HTMLElement = document.getElementById(`tree_memory${from}-${toX}`);
                el.style.top = `${mid_y -20 + 83}px`;
                el.style.left = `${mid_x -20 + 65}px`;
                /*
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
                cx.strokeText(dist.toString(), mid_x, mid_y);*/  // print distance onto circle 
                // change source of stars of cities to be green stars: 
            }
        }
    }

    clear(cx: CanvasRenderingContext2D, cx2: CanvasRenderingContext2D) {
        cx.clearRect(0, 0, 1274, 772);
        cx2.clearRect(0, 0, 1274, 772);

        for (let key of game.cities.keys()) {
            let el:HTMLImageElement = <HTMLImageElement>(document.getElementById(key)); 
            el.src = "./star.png";
        }
    } 

    draw_paths(cx: CanvasRenderingContext2D) {
        if(this.path == 0) {
            this.draw_all(cx);
        } else {
            this.draw_path(this.path, cx);
        }
    }

    draw_path(path: number, cx: CanvasRenderingContext2D): void {
        cx.fillStyle = 'rgba(0, 0, 0, 1)';
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        cx.font = ' 22px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';

        for(let i: number = 0; i < 4; ++i) {
            let from: string = game.flight_cities[game.paths[path][i]];
            let to: string = game.flight_cities[game.paths[path][i+1]];
            // !!! make this function be shared with draw hover 
            let [fx, fy] = game.cities.get(from), [tx, ty] = game.cities.get(to);
            cx.beginPath();
            cx.lineWidth = 2;
            cx.moveTo(fx, fy);
            cx.lineTo(tx, ty);
            cx.strokeStyle = 'rgba(0, 255, 0, 1)';
            cx.stroke();

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
            // change source of stars of cities to be green stars: 
            let el:HTMLImageElement = <HTMLImageElement>(document.getElementById(from)); 
            el.src = "./star_green.png";
            el = <HTMLImageElement>(document.getElementById(to));  
            el.src = "./star_green.png";
        }
        this.connect_start_goal(cx);
    }   

    draw_all(cx: CanvasRenderingContext2D) {        
        cx.fillStyle = 'rgba(0, 0, 0, 1)';
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        cx.font = ' 22px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';

        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {
                let [fx, fy] = game.cities.get(game.flight_cities[from]), [tx, ty] = game.cities.get(game.flight_cities[toX]);
                cx.beginPath();
                cx.lineWidth = 2;
                cx.moveTo(fx, fy);
                cx.lineTo(tx, ty);
                cx.strokeStyle = 'rgba(155, 223, 244, 0.9)';
                cx.stroke();
            }
        }
        // draw the line between start and goal: 
        this.connect_start_goal(cx);
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
    }

    draw_hover(cx: CanvasRenderingContext2D): void {
        if(this.hover == 0) {
            return;
        }
        let city: string = game.flight_cities[this.hover];
        cx.fillStyle = 'rgba(0, 0, 0, 1)';
        cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        cx.font = ' 22px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';

        for (let [from, to] of game.graph.entries()) {
            for(let toX of to) {

                if(game.flight_cities[toX] == city || game.flight_cities[from] == city ) {
                    let [fx, fy] = game.cities.get(game.flight_cities[from]), [tx, ty] = game.cities.get(game.flight_cities[toX]);
                    cx.beginPath();
                    cx.lineWidth = 2;
                    cx.moveTo(fx, fy);
                    cx.lineTo(tx, ty);
                    cx.strokeStyle = 'rgba(0, 255, 0, 1)';
                    cx.stroke();

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
                    // change source of stars of cities to be green stars: 
                    let el:HTMLImageElement = <HTMLImageElement>(document.getElementById(game.flight_cities[from])); 
                    el.src = "./star_green.png";
                    el = <HTMLImageElement>(document.getElementById(game.flight_cities[toX]));
                    el.src = "./star_green.png";
                }
            }
        }
    }

    evaluate_answer(path: number, sum: number) { 
        document.body.innerHTML = `
                <div class="button ice" id="return">Return to portal</div> 
                <div class="button ice" id="play_again">Play again</div> 
                <div id="highlight_users_path"></div>
                <div id="table_eval_result_bg"></div>
                <tr>
                <td>
                <!-- style="background-color: #7fdbda;" will go to any row that has been chosen to highlight players pick -->
                <table id="table_eval_result">
                    <tr><td style="height: 30px;"> </td></tr>
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            <p id="motivate">Nope! Please look at the table of sorted paths. Observe 🤔 what you have missed and give me one more try! 🙏</p> 
                        </td>
                    </tr>
                    <tr id="row1" style="z-index: 1;">
                        <td style="width: 50px;"> </td>
                        <td id="p1">
                            path1
                        </td>
                        <td id="calc1">
                            calc1
                        </td>
                        <td id="res1">
                            result1
                        </td>
                    </tr>

                    <tr id="row2" style="z-index: 1;">
                        <td style="width: 50px;"> </td>
                        <td id="p2">
                            path2
                        </td>
                        <td id="calc2">
                            calc2
                        </td>
                        <td id="res2">
                            result2
                        </td>
                    </tr>

                    <tr id="row3" style="z-index: 1;">
                        <td style="width: 50px;"> </td>
                        <td id="p3" style="z-index: 1;">
                            path3
                        </td>
                        <td id="calc3" style="z-index: 1;">
                            calc3
                        </td>
                        <td id="res3" style="z-index: 1;">
                            result3
                        </td>
                    </tr>

                    <tr id="row4" style="z-index: 1;">
                        <td style="width: 50px;"> </td>
                        <td id="p4">
                            path4
                        </td>
                        <td id="calc4">
                            calc4
                        </td>
                        <td id="res4">
                            result4
                        </td>
                    </tr>

                    <tr id="row5" style="z-index: 1;">
                        <td style="width: 50px;"> </td>
                        <td id="p5" style="text-align:center;">
                            path5
                        </td>
                        <td id="calc5">
                            calc5
                        </td>
                        <td id="res5">
                            result5
                        </td>
                    </tr>              

                    <tr id="row6" style="z-index: 1;">
                    <td style="width: 50px;"> </td>
                        <td id="p6" style="z-index: 1;">
                            path6
                        </td>
                        <td id="calc6" style="width: 250px;">
                            calc6
                        </td>
                        <td id="res6" style="width: 100px;">
                            result6
                        </td>
                    </tr>

                    <tr><td style="height: 30px;"> </td></tr>
                </table>
            </td>
            </tr>
        `;
        document.getElementById("return").addEventListener("mousedown", function() { window.location.href = "../portal.html"; });
        document.getElementById("play_again").addEventListener("mousedown", function() { window.location.reload(); });
    
        let ret:string[][] = game.evaluate_answer_g(path, sum);

        for(let i: number = 1; i < 7; i++) {
            let split_path: string[] = ret[i][0].split("+");
            document.getElementById(`p${i}`).innerHTML = `
                <table style="width:100%;"><td style="text-align: center; width:120px;">${split_path[0]}</td>
                <td style="text-align: center; width:120px;">${split_path[1]}</td>
                <td style="text-align: center; width:120px;">${split_path[2]}</td>
                <td style="text-align: center; width:120px;">${split_path[3]}</td>
                <td style="text-align: center; width:120px;">${split_path[4]}</td></table>`;
            
            document.getElementById(`calc${i}`).innerHTML = `${ret[i][1]}`;
            document.getElementById(`res${i}`).innerHTML = `${ret[i][2]}`;
            document.getElementById(`calc${i}`).style.textAlign = "center";
            document.getElementById(`res${i}`).style.textAlign = "left";
        }

        let row: number = game.players_path_order;
        let rows: number[] = [/*dummy*/-9, 207,252,300,340,383,426];
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