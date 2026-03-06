//Includes
    //Reference Files
        INCLUDE Tasklist.ink
        INCLUDE Definitions.ink

    //Data Files
        INCLUDE Functions.ink
        INCLUDE Database.ink
        
    //Game Flow
        INCLUDE Tunnels.ink
        
    //Chapters
        INCLUDE Hours/d1_1830.ink
        INCLUDE Hours/d1_1900.ink
        INCLUDE Hours/d1_2000.ink
    /*  INCLUDE Hours/d1_2100.ink
        INCLUDE Hours/d1_2200.ink
        INCLUDE Hours/d1_2300.ink
        INCLUDE Hours/d2_0000.ink
        ...
        INCLUDE Hours/d2_0700.ink   */
        INCLUDE Hours/d2_0800.ink

-> debugMenu

=== debugMenu
    +   Test the Database Function
        -> database
    +   Test the Game
        -> gameMenu
    
    -> DONE

=== gameMenu

//Game Starts
    -> d1_1830




//Empty Hours
=== d1_2100
    -> d1_2200

=== d1_2200
    -> d1_2300

=== d1_2300
    -> d2_0000

=== d2_0000
    -> d2_0100

=== d2_0100
    -> d2_0200

=== d2_0200
    -> d2_0300

=== d2_0300
    -> d2_0400

=== d2_0400
    -> d2_0500

=== d2_0500
    -> d2_0600

=== d2_0600
    -> d2_0700

=== d2_0700
    -> d2_0800