workspace "Znalostnik - Architektura systemu" {

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

        }

        # Vztahy

        ## Level 1
        teacher -> znalostnik "Vytvari, sdili a upravuje cviceni"
        student -> znalostnik "Resi cviceni, sleduje pokrok"   
        znalostnik -> mailServer "Posila e-maily"
        znalostnik -> databaseServer "Uklada data"


        ## Level 2

    }

    views {

        systemContext znalostnik {
            include *
            autolayout lr
            title "Znalostnik - Level 1"
        }

        theme default

        styles {
            element "Person" {
                background #234F80
                shape Person
            }

            element "External" {
                background grey
            }

            element "Database" {
                shape Cylinder
            }
        }
    }
}
