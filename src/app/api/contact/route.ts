import { Resend } from 'resend';
import { NextResponse, type NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactRequestBody {
    name: string;
    email: string;
    message: string;
}

function isValidBody(body: unknown): body is ContactRequestBody {
    if (typeof body !== 'object' || body === null) return false;
    const b = body as Record<string, unknown>;
    return (
        typeof b.name === 'string' &&
        b.name.length > 0 &&
        typeof b.email === 'string' &&
        b.email.includes('@') &&
        typeof b.message === 'string' &&
        b.message.length > 0
    );
}

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();

        if (!isValidBody(body)) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos.' },
                { status: 400 }
            );
        }

        const { name, email, message } = body;

        const { data, error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['dilangvidal@gmail.com'],
            replyTo: email,
            subject: `Nuevo mensaje de contacto — ${name}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
            Nuevo mensaje desde tu Portfolio
          </h2>
          <div style="background: #f5f5f4; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #1c1917;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #44403c;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a8a29e;">
            Enviado desde dilangvidal.dev
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Error al enviar el mensaje.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor.' },
            { status: 500 }
        );
    }
}
