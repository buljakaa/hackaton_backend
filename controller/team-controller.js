
exports.save = async(team,res,codeConst) => {
    
team.save(async(err) => {
    if (err) return res.status(500).json({title: 'An error occurred', error: err});
    res.status(201).json({message: 'Team created', obj: codeConst   });
    
   })
};