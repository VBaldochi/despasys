import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminStorage } from '@/lib/firebase-admin'; 
// OBS: Você deve ter o getStorage e o adminStorage exportados no firebase-admin.ts

export const runtime = 'nodejs'; // Configuração para garantir ambiente Node.js

export async function POST(request: NextRequest) {
    // IMPORTANTE: SUBSTITUIR ESTES VALORES COM A LÓGICA DE AUTENTICAÇÃO REAL
    const HARDCODED_TENANT_ID = "cme73a4c70000o2mtl6oqvbfk"; 
    const HARDCODED_USER_ID = "US_DEMO_USER_ID"; 
    
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const processoId = formData.get('processoId') as string;
        const tipo = formData.get('tipo') as string; 
        const nome = formData.get('nome') as string;

        if (!file || !processoId || !tipo || !nome) {
            return NextResponse.json({ 
                message: 'Dados incompletos. Faltando arquivo, processoId, tipo ou nome.'
            }, { status: 400 });
        }
        
        // 1. UPLOAD PARA O FIREBASE STORAGE
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        
        const storagePath = `tenants/${HARDCODED_TENANT_ID}/processos/${processoId}/${Date.now()}_${file.name}`;
        
        const fileRef = adminStorage.file(storagePath);

        await new Promise<void>((resolve, reject) => {
            const uploadStream = fileRef.createWriteStream({
                metadata: { contentType: file.type },
            });

            uploadStream.on('error', reject);
            uploadStream.on('finish', resolve);
            
            uploadStream.end(fileBuffer);
        });

        const [url] = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', 
        });
        
        // 2. SALVAR METADADOS NO POSTGRESQL (PRISMA)
        const documento = await prisma.documento.create({
            data: {
                processoId: processoId,
                tipo: tipo as any, // Cast para o ENUM TipoDocumento
                nome: nome,
                arquivo: url, 
                tamanho: fileBuffer.length,
                hash: "MOCK_HASH", 
            },
        });

        // 3. RETORNO DE SUCESSO
        return NextResponse.json({ 
            message: 'Documento enviado e registrado com sucesso!', 
            documento: documento 
        }, { status: 201 });

    } catch (error) {
        console.error('Erro no upload de documento:', error);
        return NextResponse.json({ 
            message: 'Erro interno do servidor. Verifique credenciais e paths.', 
            error: (error as Error).message
        }, { status: 500 });
    }
}