fetch('../assets/partial_all_cause_ASMR_80_89yrolds.csv')
    .then((response) => response.text())
    .then((data) => { main_chart(data, 0); });

var data_from_csv = d3.csvParse(file, (d) => { return { event: d.event, start: new Date(+d.start, 0, 1).toLocaleDateString().substring(8), end: new Date(+d.end, 0, 1).toLocaleDateString().substring(8) }; });

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
