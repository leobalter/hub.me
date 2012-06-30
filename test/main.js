/*globals module:true,test:true,ok:true,equal:true,strictEqual:true,deepEqual:true*/

module( 'Ambiente' );

test( 'jQuery', function() {
    ok( jQuery, 'jQuery existe' );
    equal( typeof( jQuery ), 'function', 'jQuery como função' );
    strictEqual( jQuery, $, 'jQuery === $' );
});

module( 'hub.me' );

test( '$.hubMe functions', function() {
    ok( $.hubMe, '$.hubMe existe' );
    equal( typeof( $.hubMe ), 'function', '$.hubMe como função' );
    equal( typeof( $.hubMe.createRepo ), 'function', '$.hubMe.createRepo é uma função' );
    equal( typeof( $.hubMe.createCategory ), 'function', '$.hubMe.createCategory é uma função' );
    equal( typeof( $.hubMe.getRepos ), 'function', '$.hubMe.getRepos é uma função' );
});

// verifica se o getRepos foi chamado e se o valor de href do #theme-css foi trocado
test( '$.hubMe content', 4, function() {
    
    var themeElem = $('#theme-css');
    var oldGetRepos = $.hubMe.getRepos;
    
    $.hubMe.getRepos = function() {
        // esse ok vai passar nas duas vezes que o $.hubMe foi chamado
        ok( true, 'getRepos foi chamado' );
    };
    
    $.hubMe();
    equal( themeElem.attr( 'href' ), 'css/themes/blue.css', '#theme-css href === blue' );

    $.hubMe({ theme: 'black' });
    equal( themeElem.attr( 'href' ), 'css/themes/black.css', '#theme-css href === black' );

    $.hubMe.getRepos = oldGetRepos;

});

test( 'getRepos', 3, function() {

    var oldGetJSON = $.getJSON;
    var username = [ 'github', 'zeno' ];

    $.getJSON = function( url, callback ) {
        ok( true, 'getJSON foi chamado' );
        equal( url, 'https://api.github.com/users/' + username.shift() + '/repos?callback=?', 'getJSON first call matches default username' );
        strictEqual( callback, $.hubMe.jsonCallback, 'getJSON arg[1] === $.hubMe.jsonCallback' );
    };

    $.hubMe.init();
    $.hubMe.getRepos();

});

test( 'mustBeShown', function() {
    $.hubMe.init();

    equal( $.hubMe.mustBeShown( null ), false, 'returns false when args[0] is null' );

    equal( $.hubMe.mustBeShown( 'JavaScript', 'github.github.com' ), false, 'username\'s own repo return false' );

    $.hubMe.init( { username: 'clark-kent' } );

    equal( $.hubMe.mustBeShown( 'JavaScript', 'clark-kent.github.com' ), false, 'user defined username\'s own repo return false' );
    ok( $.hubMe.mustBeShown( 'JavaScript', 'louis-lane' ), 'user defined username\'s own repo return false' );

    $.hubMe.init( { exclude: [ 'krypton', 'lex-lutor' ] } );
    
    equal( $.hubMe.mustBeShown( 'JavaScript', 'krypton' ), false, 'name in exclude list return false' );
    equal( $.hubMe.mustBeShown( 'JavaScript', 'lex-lutor' ), false, 'other name in exclude list return false' );

    ok( $.hubMe.mustBeShown( 'JavaScript', 'lane' ), 'other name not in exclude list make it pass' );
});