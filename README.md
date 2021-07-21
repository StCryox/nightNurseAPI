# nightNurseAPI
API in TS for the NightNurse web application.

Data format API Receive ; 
Create / Update Client
{
    "firstName": "Un prenom...",
    "lastName": "Un nom...",
    "mail": "Un mail...",
    "login": "Un login...",
    "password": "Un mot de passe...",
    "image": "Une URL image....",
    "birthdate": "2000-10-10"
}

Create / Update Provider (Prestataire)

{
    "firstName": "Un prenom...",
    "lastName": "Un nom...",
    "mail": "Un mail...",
    "login": "Un login...",
    "password": "Un mot de passe...",
    "image": "Une URL image....",
    "birthdate": "2000-10-10",
    "description": "Une description...",
    "diploma": [
                    { "filename": "Un nom de fichier...", "filePath": "Le chemin du fichier..." },
                    { "filename": "Un nom de fichier...", "filePath": "Le chemin du fichier..." }
                ],
    "experience": [
                    { "startYear": 2000, "endYear": 2000, "title": "Un titre...", "description": "Une description..." },
                    { "startYear": 2000, "endYear": 2000, "title": "Un titre...", "description": "Une description..." }
                ],
    "pricing": [
                    { "date": "2018-12-10", "startHour": 6, "endHour": 22, "price": 18000 },
                    { "date": "2018-12-10", "startHour": 6, "endHour": 22, "price": 18000 }
                ]
}

Create / Update  Booking (Réservation)

{
    "userId": "id du utilisateur",
    "providerId": "id du provider",
    "date": "2000-10-10"
}

{
    "login": "login",
    "password": "pwd"
}

