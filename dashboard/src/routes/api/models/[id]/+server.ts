import postgres from 'postgres';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DBModelRow, ValidationRow } from '$lib/stores/models/types';

const sql = postgres();

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;

  try {
    // Get model
    const modelRows: DBModelRow[] = await sql`
      SELECT * FROM model_checkpoints
      WHERE checkpoint_id = ${id}
    `;

    if (modelRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Model not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get validations
    const validationRows: ValidationRow[] = await sql`
      SELECT * FROM validations
      WHERE model_checkpoint_id = ${id}
      ORDER BY start_datetime DESC
    `;

    const model = modelRows[0];
    const result = {
      ...model,
      validations: {
        count: validationRows.length,
        latest: validationRows[0] ? {
          status: validationRows[0].validation_status,
          date: validationRows[0].start_datetime
        } : undefined
      }
    };

    return json(result);
  } catch (e) {
    console.error('Error loading model:', e);
    return new Response(JSON.stringify({ error: 'Failed to load model' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
