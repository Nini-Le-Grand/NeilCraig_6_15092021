const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({error}));
}

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    if (!!req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(error => res.status(400).json({error}));
}

exports.react = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const userId = req.body.userId;
        const userWantsToLike = (req.body.like == 1);
        const userWantsToUndo = (req.body.like == 0);
        const userWantsToDislike = (req.body.like == -1);
        if(userWantsToUndo) {
            if(sauce.usersLiked.includes(userId)) {
                let userIndex = sauce.usersLiked.indexOf(userId);
                sauce.usersLiked.splice(userIndex);
            }
            if(sauce.usersDisliked.includes(userId)) {
                let userIndex = sauce.usersDisliked.indexOf(userId);
                sauce.usersDisliked.splice(userIndex);
            }
        }
        if(userWantsToLike) {
            sauce.usersLiked.push(userId);
        };
        if(userWantsToDislike) {
            sauce.usersDisliked.push(userId);
        };
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;
        sauce.save();
        return sauce;
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(500).json({ error }));
}