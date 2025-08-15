const CharacterAnalysis = require('../models/CharacterAnalysis');

class CharacterAnalysisController {
    static async index(req, res) {
        try {
            const analysisModel = new CharacterAnalysis();
            const analyses = await analysisModel.findAll();
            
            res.render('analysis/index', {
                user: req.session.user,
                analyses: analyses.reverse() // Show newest first
            });
        } catch (error) {
            console.error('Analysis index error:', error);
            res.render('analysis/index', {
                user: req.session.user,
                analyses: [],
                error: 'Failed to load analyses'
            });
        }
    }

    static async create(req, res) {
        res.render('analysis/create', {
            user: req.session.user,
            string1: '',
            string2: '',
            result: null,
            error: null
        });
    }

    static async analyze(req, res) {
        try {
            const { string1, string2 } = req.body;
            console.log('Request body:', req.body);
            
            if (!string1 || !string2) {
                return res.render('analysis/create', {
                    user: req.session.user,
                    string1: string1 || '',
                    string2: string2 || '',
                    result: null,
                    error: 'Both strings are required'
                });
            }
            
            const analysisModel = new CharacterAnalysis();
            const result = await analysisModel.saveAnalysis(string1, string2);
            
            res.render('analysis/create', {
                user: req.session.user,
                string1,
                string2,
                result,
                error: null
            });
        } catch (error) {
            console.error('Analysis error:', error);
            res.render('analysis/create', {
                user: req.session.user,
                string1: req.body.string1 || '',
                string2: req.body.string2 || '',
                result: null,
                error: 'Analysis failed. Please try again.'
            });
        }
    }
}

module.exports = CharacterAnalysisController;