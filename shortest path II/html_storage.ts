var page_game: string = `
    <img src="nasa europe.jpg" id="europe_sat">  
    <canvas id="canvas"></canvas>
    <div id="herni_tabule"></div>
    <div id="answer_tab"></div>
    <p id="answer_text">The combination through cities:</p> 
    <p id="answer_text2">has total cost:</p> 
    <p id="answer_user1"></p>
    <input type="number" id="answer_user2" value="" min="0" max='1000' placeholder="?" autofocus/>
    <p id="answer_user3"></p>
    <div id="btn3" class="button ice toggle">Check answer</div> 
    <div id="map_elements"></div>  
    <div id="tree_elements"></div>
`;

// 🙂 🤨 😬 🙄 😒 🤯 🙈

var page_summary: string = `
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