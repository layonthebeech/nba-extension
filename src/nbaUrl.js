export const getScoreUrl = () => {
    Date.prototype.yyyymmdd = function () {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('');
    };

    var date = new Date();
    var todaysDate = date.yyyymmdd();
    return 'https://cors-anywhere.herokuapp.com/http://data.nba.com/data/5s/json/cms/noseason/scoreboard/' + todaysDate + '/games.json';
}