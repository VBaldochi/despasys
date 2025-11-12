import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Confirme seu caminho para o prisma
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // 1. Encontrar o usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // 2. [SEGURANÇA] Não revele se o usuário existe ou não.
        // Se o usuário não existir, apenas retorne OK (mas não envie e-mail).
        // Isso previne ataques de "enumeração de e-mail".
        if (!user) {
            return NextResponse.json({ message: 'Solicitação recebida.' }, { status: 200 });
        }

        // 3. Gerar um token de reset seguro
        const token = randomBytes(32).toString('hex');
        const expires = new Date(new Date().getTime() + 3600 * 1000); // Expira em 1 hora

        // 4. Salvar o token no banco de dados
        // Usando o model 'VerificationToken' que já existe no seu schema
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: token,
                expires: expires,
            },
        });

        // 5. Montar a URL de reset
        // Use a NEXTAUTH_URL do seu .env
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

        // 6. Enviar o e-mail
        await resend.emails.send({
            // from: 'DespaSys <nao-responda@despasys.com>', // Usar essa parte quando configurar o DNS da maneira correta no resend
            // to: email, // Usar essa parte quando configurar o DNS da maneira correta no resend
            from: 'DespaSys <onboarding@resend.dev>', // Remetente de teste do resend
            to: email, // Lembre-se que 'email' deve ser o seu e-mail do Resend
            subject: 'Redefinição de Senha - Despasys',
            html: `
                <h1>Redefinição de Senha</h1>
                <p>Recebemos uma solicitação para redefinir sua senha.</p>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <a href="${resetLink}">Redefinir Senha</a>
                <p>Este link expira em 1 hora.</p>
                <p>Se você não solicitou isso, ignore este e-mail.</p>
            `,
        });

        return NextResponse.json({ message: 'E-mail de redefinição enviado se o usuário existir.' }, { status: 200 });

    } catch (error) {
        console.error('Erro na solicitação de reset:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}