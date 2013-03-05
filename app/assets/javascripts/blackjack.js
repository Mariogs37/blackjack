//miscellaneous

//add underscore.js

$(function() {
  $('#startgame').click(start_game);
  $('#hit').click(hit);
  $('#stay').click(stay);
});

//create global variables

var player_hand = [];
computer_hand = [];
var hands_played = 0;
var result, hit, player_busted;
var balance = 100;
var player_value = 0;
var computer_value = 0;
deck = [];


function start_game() {
  subtract_bet();
  create_deck();
  player_hand = deck.splice(0,2);
  computer_hand = deck.splice(0,2);
  play_hand();
  hands_played++;
  return false;
}

function create_deck() {
  var suits = ["clubs", "diamonds", "hearts", "spades"];
  var ranks = [2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K', 'A']

  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      card = {suit: suits[i], rank: ranks[j]};
      if (card.rank == 'J' || card.rank == 'Q' || card.rank == 'K') {
        card.value = 10;
      }
      else if (card.rank == 'A') {
        card.value = 11;
      }
      else {
        card.value = card.rank;
      }
      deck.push(card);
    }
  }
  deck = _.shuffle(deck);
}

function play_hand() {
  computer_value = determine_hand_value(computer_hand);
  player_value = determine_hand_value(player_hand);
  show_hands();
  hit_or_stay();
  dealer_plays();
  determine_winner();
  adjust_player_balance();
}

function show_hands() {
  $('#hands').append(player_hand[0].rank + ' ' + player_hand[0].suit + ' ' + player_hand[1].rank + ' ' + player_hand[1].suit + ' ');
  $('#hands').append('Player hand value: ' + player_value + ' ');
  $('#hands').append(computer_hand[0].rank + ' ' + computer_hand[0].suit + ' ' + computer_hand[1].rank + ' ' + computer_hand[1].suit);
  $('#hands').append('Computer hand value: ' + computer_value + ' ');

}

function determine_hand_value(hand) {
  var number = 0;
  for (var i = 0; i < hand.length; i++) {
    number += hand[i].value;
  }
  return number;
}

function hit_or_stay() {
  while ( (hit == true) && (player_value < 21) ) {
    $('#hit', '#stay').show();
    if (player_value > 21) {
      player_busted = true;
      result = 'dealer_won';
    }
  }
  $('#hit', '#stay').hide();
}

function hit(hand) {
  hand.push(deck.shift());
}

function stay() {
  hit = false;
}

function dealer_plays() {
  if (player_busted != true) {
    while (computer_value < 17) {
      hit(computer_hand);
      computer_value = determine_hand_value(computer_hand);
    }
  }
}


function determine_winner() {
  if ((player_busted == true) || (computer_value > player_value)) {
    result = 'dealer_won';
    $('#result').html('Computer wins!');
  }
  else if (player_value > computer_value) {
    $('#result').html('You win!');
    result = 'player_won';
  }

  else {
    result = 'tie';
    $('#result').html('You tied with the computer!');
  }
}

function subtract_bet() {
  balance -= parseInt($('#bet').val());
}

function adjust_player_balance() {
  if (result == 'player_won') {
    balance += (2 * ($('#bet').val() ) );
  if (result == 'tie') {
    balance += $('#bet').val();
    }
  }
}








