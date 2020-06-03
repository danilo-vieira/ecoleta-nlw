import { Router } from 'express';
import knex from './database/connection';

interface IRequest {
    name: string;
    email: string;
    whatsapp: string;
    longitude: number;
    latitude: number;
    city: string;
    uf: number;
    items: number[];
}

const routes = Router();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*');

  const serializedItems = items.map(item => ({
    id: item.id,
    title: item.title,
    image_url: `http://localhost:3333/uploads/${item.image}`,
  }))

  return response.json(serializedItems)
})

routes.post('/points', async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    longitude,
    latitude,
    city,
    uf,
    items
  } = request.body;

  const trx = await knex.transaction();

  const ids = await trx('points').insert({
    image: 'image-fake',
    name,
    email,
    whatsapp,
    longitude,
    latitude,
    city,
    uf
  });

  const point_id = ids[0];

  const pointItems = items.map((item_id: number) => {
    return {
      item_id,
      point_id,
    };
  })
  
  await trx('point_items').insert(pointItems)

  return response.json({success: true})
})

export default  routes;