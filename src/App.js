import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-unfetch';
import Collapsible from 'react-collapsible';
import snoowrap from 'snoowrap';
import passwords from './passwords.js';

const r = new snoowrap({
  userAgent: '/u/layonthebeech myApp@1.0.0',
  clientId: passwords.clientId,
  clientSecret: passwords.clientSecret,
  username: passwords[reddit-username],
  password: passwords[reddit-password]
});





class App extends Component {
  state = {
    games: []
  }
  componentDidMount = () => {
    this.gameList()

  }
  getScoreUrl = () => {
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
  getGameUrl(game) {
    const teamName = game.home.nickname;
    fetch('https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/nbastreams/search.json?q=' + teamName + '&restrict_sr=on')
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
  }
  parseComments(c){
    const comments = c[1].data.children
    if(comments.length > 0) {
      var links = [];
      comments.map((comment) =>{
        var re = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
    
        if(comment.data.body && comment.data.body.match(re)) {
          
          links.push(comment.data.body.match(re)[0]);
        }
      })
      return links;
    }
  }
  gameList() {
    fetch(this.getScoreUrl())
      .then((res) => res.json())
      .then((results) => {
        const gamesObject = results.sports_content.games.game;
        const games = [];
        gamesObject.map((singleGame) => {
          const game = {}
          game.thread = '';
          game.links = [];
          game.home = {
            'nickname': singleGame.home.nickname,
            'score': singleGame.home.score,
          };
          game.visitor = {
            'nickname': singleGame.visitor.nickname,
            'score': singleGame.visitor.score,
          };
          games.push(game)
        })
        var promises = games.map(game => {
          const url = 'https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/nbastreams/search.json?q=' + game.home.nickname + '&restrict_sr=on'
          return fetch(url)
        })
        Promise.all(promises).then(results => {
          results.map((result, i) => {
            result.json()
            .then((res) => {
              const url =  'https://cors-anywhere.herokuapp.com/https://www.reddit.com'+res.data.children[0].data.permalink+'.json'
              fetch(url)
              .then(results => {
                results.json()
                .then((res) => {
                  games[i].links = this.parseComments(res).splice(0,10);
                 
                  this.setState({games:games})
                })
              })
            })
          })
        });
      })
  }

  render() {
    const fiveGames = [];
    const style = {
      body: {
        textAlign: 'center'
      },
      main: {
        maxWidth: 200

      },
      game: {
        backgroundColor: 'grey',
        margin: 10,
        textAlign: 'center'
      }
    }
    return (
      <div style={style}>
        <h1>Today's Games</h1>
        <div className='main'>
          <div className="container">
            {console.log(this.state.games)}
            {this.state.games.map(game => (
               <div key={game.id} className="row">
                <div className="col-xs-12">
                  <div style={style.game} key={game.id} id={game.id}>
                    <div className="container">
                      <div className="row">
                        <div className='home col-xs-6'>
                          <h1>{game.home.nickname}</h1>
                          <h1>{game.home.score == "" ? 0 : game.home.score}</h1>
                        </div>
                        <div className="visitor col-xs-6">
                          <h1>{game.visitor.nickname}</h1>
                          <h1>{game.visitor.score == "" ? 0 : game.home.score}</h1>
                        </div>
                      </div>
                    </div>
                    <Collapsible trigger="Look at Game Streams">
                      yo

                      {game.links.map(link => {
                        return <div><a href={link} key={link}> {link} </a></div>
                      })}
                  </Collapsible>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
