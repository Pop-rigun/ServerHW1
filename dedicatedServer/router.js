// TODO: add GET method to get all positions
const { addNewPosition, getAllPositions } = require('./positions');
module.exports = {
    router: {
        post: async (newPosition, res) => {
            // Note: newPosition JSON example:
            /*
              {
                  "company": "Rakuten",
                  "level": "junior",
                  "description": "This position is for young and talented developers",
                  "category": "nodejs"
              }
             */
            try {
                const id = await addNewPosition(newPosition);
                res.setHeader('Location', '/positions/' + id);
                res.statusCode = 201;
                res.end();
                return `New position with id='${id}' created`;
            } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify(e));
                return e;
            }
        },
        get: async (req,res) => {
            try {
                const allPos = await getAllPositions();
                pos = JSON.stringify(allPos)
                res.statusCode = 200;
                res.end(pos);
                return `All position: ${pos}`;
            } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify(e));
                return e;
            }
        }
    }
}