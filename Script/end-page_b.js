setTimeout(start, 100)


function start() {
    let rating_box = document.getElementById('rating-box')
    rating_box.innerHTML = ""


    answer_string = "A;Altenberg;Albanien;Attersee;Alhamdulia;Aquamarine;123;123;400;B;Berlin;Bulgarien;Bodensee;Ben;Blau;123;123;500";
    let answers = answer_string.split(";");


    if (gameoption === "schnell") {
        box_length = 5;
    }
    if (gameoption === "normal") {
        box_length = 8;
    }
    if (gameoption === "senioren") {
        box_length = 6;
    }

    let categories_count = box_length + 1;




    let str = `<tr>`;
    for (let i = 0; i < box_length; i++) {
        if (i == 0) {
            str += `
            <th class="left">
                ${categories[category][i]["category" + (i + 1)]}
            </th>`;
        } else {
            str += `
            <th>
                ${categories[category][i]["category" + (i + 1)]}
            </th>`;
        }
    }

    str += `<th>Points</th></tr><tr>`;

    let html_code = str + ``;

    for (let i = 0; i < answers.length; i++) {
        //console.log(answers[i]);
        if (i % categories_count == 0) {
            html_code += `
            </tr>
            <tr>
                <td class="left" id="table-${i}">${answers[i]}</td>
            `;
        } else {
            console.log(i);
            html_code += `
            <td id="table-${i}">${answers[i]}</td>
        `;
        }
    }
    html_code += "</tr>";
    rating_box.innerHTML += html_code;
}