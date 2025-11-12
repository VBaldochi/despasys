import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // Você precisará: npm install bcryptjs @types/bcryptjs

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        // 1. Validar a nova senha (Ex: mínimo de 8 caracteres)
        if (!password || password.length < 8) {
            return NextResponse.json({ message: 'Senha inválida (mínimo 8 caracteres).' }, { status: 400 });
        }

        // 2. Encontrar o token no banco
        const resetToken = await prisma.verificationToken.findUnique({
            where: { token: token },
        });

        // 3. Validar o token
        if (!resetToken) {
            return NextResponse.json({ message: 'Token inválido.' }, { status: 400 });
        }

        // 4. Verificar se o token expirou
        if (new Date() > new Date(resetToken.expires)) {
            // Opcional: Limpar o token expirado
            await prisma.verificationToken.delete({ where: { token } });
            return NextResponse.json({ message: 'Token expirado.' }, { status: 400 });
        }

        // 5. Criptografar a nova senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Atualizar a senha do usuário
        await prisma.user.update({
            where: { email: resetToken.identifier },
            data: {
                password: hashedPassword,
            },
        });

        // 7. [SEGURANÇA] Excluir o token após o uso
        await prisma.verificationToken.delete({
            where: { token: token },
        });

        return NextResponse.json({ message: 'Senha redefinida com sucesso!' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}