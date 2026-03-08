//Includes
    //Reference Files
        INCLUDE Tasklist.ink
        INCLUDE Definitions.ink

    //Data Files
        INCLUDE Functions.ink
        INCLUDE Database.ink
        INCLUDE IdeaSystem.ink
        
    //Game Flow
        INCLUDE Tunnels.ink
        INCLUDE Observations.ink
        
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

