/*! hub.me - v1.0.1 - 2012-06-30
* Copyright (c) 2012/06/30 Zeno Rocha; Licensed WTF-PL */

$.hubMe = (function() {
    var hubMe, options;

    hubMe = function( opts ) {
        $.hubMe.init( opts );
        
        // get repository
        $.hubMe.getRepos();
    };

    hubMe.init = function( opts ) {
        var defaults = {
            username: 'github',
            theme: 'blue',
            exclude: [],
            languages: true
        };

        options = $.extend( {}, defaults, opts );
        
        // add theme
        $( '#theme-css' ).attr( 'href', 'css/themes/' + options.theme + '.css' );
    };

    hubMe.createRepo = function() {

    };

    hubMe.createCategory = function() {

    };

    hubMe.getRepos = function() {
        var username = 'https://api.github.com/users/' + options.username + '/repos?callback=?';
        $.getJSON( username, $.hubMe.jsonCallback );
    };

    hubMe.mustBeShown = function( lang, name ) {

        if ( lang === null ) {
            return false;
        }

        if ( name === ( options.username + '.github.com' ) ) {
            return false;
        }

        if ( $.inArray( name, options.exclude ) >= 0 ) {
            return false;
        }

        return true;
        
    };

    hubMe.jsonCallback = function( result ) {

        var repos = [],
            data,
            resultData = result.data,
            repo;

        for ( data in resultData ) {
            if ( resultData.hasOwnProperty( data ) ) {
                repo = resultData[ data ];

                if ( $.hubMe.mustBeShown( repo.language, repo.name ) ) {
                    repos.push( repo );
                }
            }
        }
        
        repos = $.hubMe.orderByLanguages( repos );
        
        $.each(repos, function(i, field) {
                            
            if (options.languages) {  
                
                if (i > 0) {
                    if (repos[i].language !== repos[i-1].language) {
                        $.hubMe.createCategory(repos[i].language);
                    }
                }
                else {
                    $.hubMe.createCategory(repos[i].language);
                }
                
            }
            
            $.hubMe.createRepo(repos[i]);

        });

    };

    hubMe.orderByLanguages = function(repos) {
        return repos.sort(function(a, b) {
                
                var langA = a.language, 
                    langB = b.language;

                if (langA < langB) {
                    return -1;
                }
                if (langA > langB) {
                    return 1;
                }

            });
    };

    return hubMe;

}(jQuery));