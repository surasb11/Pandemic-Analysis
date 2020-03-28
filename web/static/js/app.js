d3.json("static/data/covid_usa.json", function(data){

    //   data.filter(object => object.country=="USA");
      console.log(data);
    
    
    //var tableData = data;
    
    var tbody = d3.select("tbody");
    var button = d3.select("#filter-btn");
    var inputField1 = d3.select("#state");
    var inputField2 = d3.select("#county");
    var resetbtn = d3.select("#reset-btn");
    var columns = ["county", "state", "country", "cases", "deaths", "lat", "long"]
    
    
    var populate = (dataInput) => {
        dataInput.forEach(covid => {
            var row = tbody.append("tr");
            Object.values(covid).forEach(column => row.append("td").text(column)
            )
        });
    }
    //Populate table
    populate(data);
    
    var covidData = data
    
    // Filter by attribute
    button.on("click", () => {
        d3.event.preventDefault();
        var inputState = inputField1.property("value").trim();
        var inputCounty = inputField2.property("value").trim();
        // Filter by field matching input value
        var filterState = data.filter(covidData => covidData.state === inputState);
        console.log(filterState)
        
        var filterCounty = data.filter(covidData => covidData.county === inputCounty);
        console.log(filterCounty)
        
        var filterData = data.filter(covidData => covidData.state === inputState && covidData.county === inputCounty);
        console.log(filterData)
    
        // Add filtered sighting to table
        tbody.html("");
    
        let response = {
            filterData, filterState, filterCounty
        }
    
        if (response.filterData.length !== 0) {
            populate(filterData);
        }
            else if (response.filterState.length !== 0 ){
                populate(filterState);
            }
            else if (response.filterCounty.length !== 0){
                populate(filterCounty);
            }
            else {
                tbody.append("tr").append("td").text("No results found!"); 
            }
    })
    
    resetbtn.on("click", () => {
        tbody.html("");
        populate(data)
        console.log("Table reset")
    })
    
    });
    