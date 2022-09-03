fetch('../assets/partial_all_cause_ASMR_80_89yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 0); });
fetch('../assets/all_cause_ASMR_80_89yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 1); });
fetch('../assets/involving_covid_ASMR_80_89yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 2); });
fetch('../assets/non_covid_ASMR_80_89yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 3); });
fetch('../assets/involving_covid_ASMR_60_69yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 4); });
fetch('../assets/non_covid_ASMR_60_69yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 5); });
fetch('../assets/full_involving_covid_ASMR_60_69yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 6); });
var main_chart = (file, i) => {
    var deaths_all = d3.csvParse(file, (d) => { return { month: new Date(+d.month.split("-")[0], +d.month.split("-")[1] - 1, 1).toLocaleDateString().substring(3, 5).concat("/" + new Date(+d.month.split("-")[0], +d.month.split("-")[1] - 1, 1).toLocaleDateString().substring(8)), ASMRper100kpersonyears: +d.ASMRper100kpersonyears, group: d.group, }; });

    var chart = SlopeChart(deaths_all, {
        x: d => d.month,
        y: d => d.ASMRper100kpersonyears,
        z: d => d.group,
        width: 960,
        height: 400,
        format: ".0f"
    });
    document.querySelector(`p[id='placeholder${i}']`).replaceWith(chart);
}
