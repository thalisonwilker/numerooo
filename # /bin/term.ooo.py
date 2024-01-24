# /bin/python3
from random import randint

numeros = [ randint(0, 9) for x in range(0, 4)]
tentativas = 0
sugestoes = []

def feedback(sugestao):
    feed = ""
    for i in range(0, 4):
        valor_numeros = int(numeros[i])
        valor_sugestao = int(sugestao[i])
        if(valor_sugestao not in numeros):
            print('\t' * 6, f"{valor_sugestao} não faz parte ")
        elif(valor_sugestao != valor_numeros):
            print('\t' * 6, f"{valor_sugestao} esta certo, mas na posição errada ")
        else:
            print('\t' * 6, f"{valor_sugestao} esta certo e na posição certa ")
        feed += str(valor_sugestao)
    return feed

while True:
    sugestao = input("Sugestão, ex: 1234: ")
    sugestao = [ int(c) for c in sugestao ]
    feedback(sugestao)
    sugestoes.append(sugestao)
    tentativas += 1
    if(sugestao == numeros):
        print("você acertou!")
        break

print(numeros)
print(tentativas)
print("Sugestões")
[ print(sugestao) for sugestao in sugestoes ]
