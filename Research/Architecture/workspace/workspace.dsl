workspace "Znalostnik - Architektura systemu" {
    
    !identifiers hierarchical

    model {

        # Externi sluzby
        mailServer = softwareSystem "Mail Server" "Externi mail server" {
            tags "External, Mail"
        }

        databaseServer = softwareSystem "Server Databaze" "Externi databaze" {
            tags "External, Database"
        }

        # Actors
        teacher = person "Ucitel" {
            tags "Person"
        }

        student = person "Student" {
            tags "Person"
        }

        # Aplikace
        znalostnik = softwareSystem "Znalostnik" "Platforma pro vytvareni a sdileni vyukovych cviceni" {

            frontend = container "Frontend" {
                description "Webova aplikace"
                technology "Angular (webova aplikace) + Capacitor (nativni mobilni aplikace) + Nginx"
                tags "proxyNet, frontNet"

                dashboard = component "Dashboard" {
                    description "Zobrazi vsechny dulezite casti"
                }

                editorExercise = component "Editor Exercise" {
                    description "Vytvari cviceni za pomoci sablon, atd..."
                }

                exerciseCreation = component "Exercise Creator" {
                    description "Vytvari cviceni za pomoci nejakeho nastroje"
                }               
                
                temporaryLinkCreator = component "Temporary Link Creator" {
                    description "Vytvari docasny link pro dane cviceni"
                } 

                signIn = component "Sign In User" {
                    description "Vytvari docasny link pro dane cviceni"
                } 

                userRegistration = component "User Registration" {
                    description "Vytvari docasny link pro dane cviceni"
                }  

                userSession = component "User Session" {
                    description "Spravuje stav uzivatele, nejaka cache - slouzi offline, online"
                }   

                trackingStatistic = component "Tracking Statistic" {
                    description "Vytvari statistiku urcitych uzivatelu - gamifikace"
                }  

                roomManager = component "Room Manager" {
                    description "Sprava mistnosti pro cviceni"
                }   
            }

            backend = container "Backend" {
                description "REST API + komunikace mezi ostatnimi"
                technology "ASP.NET Core"                
                tags "proxyNet, frontNet, backNet"

                signInVerification = component "Sign In Verification" {
                    description "Kontrola prihlasovacich udaju"
                }    

                userCreation = component "User Creation" {
                    description "Vytvari uzivatele"
                }   

                userValidator = component "User Validator" {
                    description "Validuje spravne udaje pri vytvareni uzivatele"
                }    

                exerciseCreation = component "Exercise Creation" {
                    description "Uklada zmeny/nove cviceni do databaze"
                }  

                importExercise = component "Import Exercise" {
                    description "Vlozeni cviceni do databaze v urcitem formatu"
                }  

                importFormatValidator = component "Import Format Validator" {
                    description "Validuje vlozeny format"
                }   

                exportExercise = component "Export Exercise" {
                    description "Stanuti cviceni ze serveru v urcitem formatu"
                }  

                creationRoom = component "Creation Room" {
                    description "Vytvari se mistnost, kde se nasazuje cviceni, aby se na nem mohli pripojit uzivatele"
                }  

                updaterRoom = component "Updater Room" {
                    description "Zajistuje synchronizaci uzivatelu a aktualizuje jejich stav"
                } 

                usersSynchronization = component "Users Synchronization" {
                    description "Zajistuje synchronizaci uzivatelu a aktualizuje jejich stav"
                } 

                monitorAbuseDetection = component "Monitor Abuse Detection" {
                    description "Monitoruje, zda uzivatele nevytvareji mnoho linku, vytvareni, atd..."
                } 

                templateSelection = component "Template Selection" {
                    description "Vyber sablony pro vytvoreni cviceni"
                } 	

                playerStatistic = component "Player Statistic" {
                    description "Vysledky hracu"
                } 

                offlineSynchronization = component "Offline Synchronization" {
                    description "Zajistuje synchronizaci dat pokud uzivatel nebyl napojen k internetu"
                }   	 

                liveRoomManager = component "Live Room Manager" {
                    description "Zajistuje beh mistnosti, ktere prave bezi"
                }  
            }

            database = container "Database" {
                description "Uklada data aplikace"
                technology "PostgreSQL + PG Cron (Scheduler)"
                tags "backNet"

                pgCron = component "Scheduler zmen" {
                    description "Maze docasne uzivatele, cviceni po nejakou dobu"
                } 
            }

            reverseProxy = container "ReverseProxy" {
                description "Preposila pozadavky na backend a frontend"
                technology "Nginx"                
                tags "proxyNet"
            }

            adminer = container "Adminer" {
                description "Database klient"
                technology "Adminer"                
                tags "backNet"
            }
        }

        # Vztahy - Level 1
        teacher -> znalostnik "Vytvari, sdili a upravuje cviceni"
        student -> znalostnik "Resi cviceni, sleduje pokrok"   
        znalostnik -> mailServer "Posila e-maily"
        znalostnik -> databaseServer "Uklada data"


        # Vztahy - Level 2

        teacher -> znalostnik.reverseProxy "Posila pozadavky"
        student -> znalostnik.reverseProxy "Posila pozadavky"

        znalostnik.reverseProxy -> znalostnik.frontend "Preposila pozadavky"
        znalostnik.reverseProxy -> znalostnik.backend "Preposila pozadavky"
       
        znalostnik.frontend -> znalostnik.reverseProxy "Vraci odpoved"
        
        znalostnik.backend -> znalostnik.reverseProxy "Vraci odpoved"
        znalostnik.backend -> znalostnik.database "CRUD operace"

        znalostnik.database -> znalostnik.backend "Vraci vysledek"
        znalostnik.database -> znalostnik.adminer "Vraci vysledek"

        znalostnik.adminer -> znalostnik.database "CRUD operace"


        # Vztahy - Level 3

        znalostnik.reverseProxy -> znalostnik.frontend.editorExercise "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.temporaryLinkCreator "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.signIn "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.trackingStatistic "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.dashboard "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.userRegistration "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.roomManager "Zadost o stranku"
        znalostnik.reverseProxy -> znalostnik.frontend.exerciseCreation "Zadost o stranku"


        znalostnik.frontend.signIn -> znalostnik.reverseProxy "Zadost o prihlaseni"
        znalostnik.frontend.userRegistration -> znalostnik.reverseProxy "Zadost o registraci"
        znalostnik.frontend.temporaryLinkCreator -> znalostnik.reverseProxy "Zadost o vytvoreni docasneho linku"
        znalostnik.frontend.trackingStatistic -> znalostnik.reverseProxy "Zadost o statistiky uzivatelu"

        znalostnik.reverseProxy -> znalostnik.backend.userCreation "Zadost o registraci"
        znalostnik.backend.userCreation -> znalostnik.reverseProxy "Vysledek registrace"

        znalostnik.backend.userCreation -> znalostnik.backend.userValidator "Validace dat"
        znalostnik.backend.userValidator -> znalostnik.backend.userCreation "Vysledek validace dat"

        znalostnik.reverseProxy -> znalostnik.backend.signInVerification "Zadost o prihlaseni"
        znalostnik.backend.signInVerification -> znalostnik.reverseProxy "Vysledek prihlaseni"

        znalostnik.reverseProxy -> znalostnik.backend.updaterRoom "Zmena stavu mistnosti"
        znalostnik.backend.updaterRoom -> znalostnik.backend.usersSynchronization "Rozesilani noveho stavu"
        znalostnik.backend.updaterRoom -> znalostnik.backend.liveRoomManager "Nastaveni noveho stavu"
        znalostnik.backend.usersSynchronization -> znalostnik.reverseProxy "Aktualizace stavu uzivatelu"

        znalostnik.reverseProxy -> znalostnik.backend.exerciseCreation "Ulozeni stavu vytvareni cviceni"
        znalostnik.backend.exerciseCreation -> znalostnik.reverseProxy "Nacteni stavu vytvareni cviceni"

        znalostnik.reverseProxy -> znalostnik.backend.offlineSynchronization "Zadost o synchronizaci dat"
        znalostnik.backend.offlineSynchronization -> znalostnik.reverseProxy "Aktualizace uzivatele pro synchronizaci"

        znalostnik.reverseProxy -> znalostnik.backend.playerStatistic "Zadost o statistiku uzivatelu"
        znalostnik.backend.playerStatistic -> znalostnik.reverseProxy "Statistika uzivatelu"

        znalostnik.reverseProxy -> znalostnik.backend.importExercise "Zadost o ulozeni formatu cviceni"
        znalostnik.backend.importExercise -> znalostnik.backend.importFormatValidator "Validace formatu cviceni"
        znalostnik.backend.importFormatValidator -> znalostnik.backend.importExercise "Vysledek validace cviceni"

        znalostnik.reverseProxy -> znalostnik.backend.exportExercise "Zadost o nacteni vybraneho cviceni"
        znalostnik.backend.exportExercise -> znalostnik.reverseProxy "Vybrane cviceni v formatu"

        znalostnik.reverseProxy -> znalostnik.backend.templateSelection "Zadost o nacteni vybraneho cviceni"
        znalostnik.backend.templateSelection -> znalostnik.reverseProxy "Vybrane cviceni"

        znalostnik.reverseProxy -> znalostnik.backend.creationRoom "Zadost o vytvoreni mistnosti"
        znalostnik.backend.creationRoom -> znalostnik.reverseProxy "Odkaz na mistnost"
        znalostnik.backend.creationRoom -> znalostnik.backend.liveRoomManager "Zarad novou mistnost do systemu"

        znalostnik.backend.monitorAbuseDetection -> znalostnik.backend.liveRoomManager "Detekuje znamky zneuziti systemu" 
        # Vztahy - Level 4
    }


    views {

        systemContext znalostnik {
            include *
            autolayout lr
            title "Znalostnik - Level 1 - System Context"
        }

        container znalostnik {
            include *
            autolayout lr
            title "Znalostnik - Level 2 - Kontejnery"
        }

        component znalostnik.frontend "Frontend" {
            include *
            autolayout lr
            title "Znalostnik - Level 3 - Componenty Frontend"
        }

        component znalostnik.backend "Backend" {
            include *
            autolayout lr
            title "Znalostnik - Level 3 - Componenty Backend"
        }

        component znalostnik.database "Database" {
            include *
            autolayout lr
            title "Znalostnik - Level 3 - Componenty Database"
        }

        theme default

        styles {
            element "Person" {
                background #234F80
                color white
                shape Person
            }

            element "External" {
                background grey
                color white
            }

            element "Database" {
                shape Cylinder
            }

            element "backNet" {
                background #75eb9c
            }

            element "frontNet" {
                background #ecdb8d
            }

            element "proxyNet" {
                background #90d6f4
            }
        }
    }
}
