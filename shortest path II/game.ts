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

        // 1. save which path is the answer and whether player has answered its sum correctly 
        this.answer_path_in = path;
        this.answer_sum_in = distance;
        if(int_sum[path] == distance) // correct sum answer 
            this.answer_sum = true;    
        // 2. sort the paths by distance
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
            if(ret[i][0] == copy[path][0]) { // is ret of i equal to copy of path ? if so user picked this path in sorted array of paths 
                this.players_path_order = i;
                if(i == 1)
                    this.answer_path = true;
            }
        }
        this.game_over = true;
        return ret;
    }
}