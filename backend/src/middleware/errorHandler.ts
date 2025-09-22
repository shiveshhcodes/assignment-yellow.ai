import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  const statusCode = error.statusCode || 500;
  console.error(`Error ${statusCode}: ${error.message}`);
  console.error(error.stack);
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.validation,
    });
  }
  if (error.message.includes('Unique constraint')) {
    return reply.status(409).send({
      error: 'Resource already exists',
    });
  }
  if (error.message.includes('Record not found')) {
    return reply.status(404).send({
      error: 'Resource not found',
    });
  }
  const response = {
    error: statusCode >= 500 ? 'Internal server error' : error.message,
  };
  return reply.status(statusCode).send(response);
};
