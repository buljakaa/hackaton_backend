// I morate napraviti metodu koja ce biti pozvana od strane rute, a ta metoda da poziva odvojenu metodu koja prima samo te parametere
// kao updateUser i updateUserMethod

// Morate da se odlucite da li cete ovako sa callback i da koristite .catch i .then na metodu ili cete sa try-catch blokovima da radite
exports.save = async (team, res, codeConst) => {
    team.save(async (err) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        res.status(201).json({message: 'Team created', obj: codeConst});
    });
};
