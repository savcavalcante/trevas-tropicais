import os
import re
import csv
import tkinter as tk
from tkinter import ttk, messagebox

try:
    from PIL import Image, ImageTk
    TEM_PILLOW = True
except ImportError:
    TEM_PILLOW = False

PASTA_COLECOES = "colecoes"
DOMINIO_SITE = "https://trevastropicais.art.br"
ARQUIVO_CSV = "atualizacoes_planilha.csv"


class GerenciadorAcervoApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Trevas Tropicais - Gestor de Acervo & Loja")
        self.root.geometry("820x620")
        self.root.configure(padx=20, pady=20)

        self.catalogo = {}
        self.img_preview_ref = None

        self.carregar_catalogo()
        self.criar_interface()

    def carregar_catalogo(self):
        """Lê todos os HTMLs da pasta colecoes e mapeia as fotos sem alterar a estrutura original."""
        self.catalogo.clear()
        if not os.path.exists(PASTA_COLECOES):
            messagebox.showerror("Erro", f"Pasta '{PASTA_COLECOES}' não encontrada. Rode o script na raiz do site.")
            return

        padrao_img = re.compile(r'<img\b[^>]*>', re.IGNORECASE | re.DOTALL)
        padrao_src = re.compile(r'\bsrc=["\']([^"\']+)["\']', re.IGNORECASE)
        padrao_loja = re.compile(r'\bdata-loja=["\']([^"\']*)["\']', re.IGNORECASE)
        padrao_titulo = re.compile(r'\bdata-titulo=["\']([^"\']*)["\']', re.IGNORECASE)

        for arquivo in sorted(os.listdir(PASTA_COLECOES)):
            if not arquivo.endswith(".html"):
                continue

            caminho = os.path.join(PASTA_COLECOES, arquivo)
            nome_colecao = arquivo.replace(".html", "")

            with open(caminho, "r", encoding="utf-8") as f:
                conteudo = f.read()

            for match in padrao_img.finditer(conteudo):
                tag_img = match.group(0)
                if "foto-portfolio" not in tag_img:
                    continue

                src_m = padrao_src.search(tag_img)
                if not src_m:
                    continue

                src = src_m.group(1)
                nome_arquivo = os.path.basename(src)

                # Limpa qualquer "../" inicial para montar URL pública exata
                caminho_relativo_limpo = re.sub(r'^(\.\./)+', '', src).lstrip('/')
                url_foto_publica = f"{DOMINIO_SITE}/{caminho_relativo_limpo}"
                caminho_local = os.path.normpath(os.path.join(PASTA_COLECOES, src))

                loja_m = padrao_loja.search(tag_img)
                link_loja = loja_m.group(1).strip() if loja_m else ""

                titulo_m = padrao_titulo.search(tag_img)
                titulo_obra = titulo_m.group(1).strip() if titulo_m else ""

                if nome_arquivo not in self.catalogo:
                    self.catalogo[nome_arquivo] = {
                        "colecoes": [nome_colecao],
                        "url_foto": url_foto_publica,
                        "caminho_local": caminho_local,
                        "link_loja": link_loja,
                        "titulo": titulo_obra
                    }
                else:
                    if nome_colecao not in self.catalogo[nome_arquivo]["colecoes"]:
                        self.catalogo[nome_arquivo]["colecoes"].append(nome_colecao)
                    if link_loja and not self.catalogo[nome_arquivo]["link_loja"]:
                        self.catalogo[nome_arquivo]["link_loja"] = link_loja
                    if titulo_obra and not self.catalogo[nome_arquivo]["titulo"]:
                        self.catalogo[nome_arquivo]["titulo"] = titulo_obra

        self.lista_arquivos = sorted(self.catalogo.keys())

    def criar_interface(self):
        # --- SEÇÃO 1: ATUALIZAR HTML ---
        frame_html = ttk.LabelFrame(self.root, text=" 1. Injetar Link e Título no Código do Site (HTML) ", padding=15)
        frame_html.pack(fill="x", pady=(0, 15))

        frame_campos = ttk.Frame(frame_html)
        frame_campos.grid(row=0, column=0, sticky="nsew", padx=(0, 15))

        ttk.Label(frame_campos, text="Arquivo da Foto (digite para filtrar):").grid(row=0, column=0, sticky="w", pady=4)
        self.combo_arquivo = ttk.Combobox(frame_campos, values=self.lista_arquivos, width=38)
        self.combo_arquivo.grid(row=1, column=0, sticky="ew", pady=(0, 4))
        self.combo_arquivo.bind("<KeyRelease>", self.filtrar_combobox)
        self.combo_arquivo.bind("<<ComboboxSelected>>", self.ao_selecionar_foto)

        self.lbl_info_foto = ttk.Label(frame_campos, text="Selecione uma foto para ver a prévia e coleções.", foreground="#555555")
        self.lbl_info_foto.grid(row=2, column=0, sticky="w", pady=(0, 10))

        ttk.Label(frame_campos, text="Título da Obra (para Loja / Futuro):").grid(row=3, column=0, sticky="w", pady=2)
        self.entry_titulo = ttk.Entry(frame_campos, width=42)
        self.entry_titulo.grid(row=4, column=0, sticky="ew", pady=(0, 8))

        ttk.Label(frame_campos, text="Link da Loja (Nuvemshop):").grid(row=5, column=0, sticky="w", pady=2)
        self.entry_link = ttk.Entry(frame_campos, width=42)
        self.entry_link.grid(row=6, column=0, sticky="ew", pady=(0, 12))

        btn_atualizar = ttk.Button(frame_campos, text="Atualizar HTML(s) do Site", command=self.atualizar_html)
        btn_atualizar.grid(row=7, column=0, sticky="e")

        frame_campos.columnconfigure(0, weight=1)

        # Prévia da Imagem
        frame_preview = tk.Frame(frame_html, width=220, height=220, bg="#141414", bd=1, relief="solid")
        frame_preview.grid(row=0, column=1, sticky="n")
        frame_preview.pack_propagate(False)

        texto_inicial = "Prévia da Foto" if TEM_PILLOW else "Instale 'python3-pil.imagetk'\npara ver miniaturas .webp"
        self.lbl_thumbnail = tk.Label(frame_preview, text=texto_inicial, bg="#141414", fg="#888888", justify="center")
        self.lbl_thumbnail.pack(expand=True, fill="both")

        frame_html.columnconfigure(0, weight=1)

        # --- SEÇÃO 2: EXPORTAR CSV PARA PLANILHA ---
        frame_csv = ttk.LabelFrame(self.root, text=" 2. Exportar CSV para Planilha de Controle ", padding=15)
        frame_csv.pack(fill="both", expand=True)

        ttk.Label(
            frame_csv,
            text="Nomes dos arquivos para exportar (separados por vírgula ou espaço).\n"
                 "Obs: Toda foto atualizada acima entra aqui automaticamente!"
        ).pack(anchor="w", pady=(0, 6))

        self.txt_exportar = tk.Text(frame_csv, height=5, width=60)
        self.txt_exportar.pack(fill="both", expand=True, pady=(0, 10))

        frame_botoes_csv = ttk.Frame(frame_csv)
        frame_botoes_csv.pack(fill="x")

        btn_limpar = ttk.Button(frame_botoes_csv, text="Limpar Lista", command=lambda: self.txt_exportar.delete("1.0", tk.END))
        btn_limpar.pack(side="left", padx=(0, 8))

        btn_puxar_com_link = ttk.Button(frame_botoes_csv, text="Puxar Todas com Link", command=self.puxar_todas_com_link)
        btn_puxar_com_link.pack(side="left")

        btn_exportar = ttk.Button(frame_botoes_csv, text="Gerar CSV para Planilha", command=self.exportar_csv)
        btn_exportar.pack(side="right")

    def carregar_thumbnail(self, caminho_local):
        if not TEM_PILLOW:
            return

        if not os.path.exists(caminho_local):
            self.lbl_thumbnail.config(image="", text=f"Arquivo não achado:\n{caminho_local}")
            self.img_preview_ref = None
            return

        try:
            img = Image.open(caminho_local)
            img.thumbnail((210, 210), Image.Resampling.LANCZOS)
            foto_tk = ImageTk.PhotoImage(img)
            self.img_preview_ref = foto_tk
            self.lbl_thumbnail.config(image=foto_tk, text="")
        except Exception as e:
            self.lbl_thumbnail.config(image="", text=f"Erro ao abrir foto:\n{e}")
            self.img_preview_ref = None

    def filtrar_combobox(self, event):
        if event.keysym in ("Up", "Down", "Left", "Right", "Return", "Tab"):
            return
        termo = self.combo_arquivo.get().lower()
        if not termo:
            self.combo_arquivo["values"] = self.lista_arquivos
        else:
            filtrados = [item for item in self.lista_arquivos if termo in item.lower()]
            self.combo_arquivo["values"] = filtrados

    def ao_selecionar_foto(self, event=None):
        arquivo = self.combo_arquivo.get().strip()
        if arquivo in self.catalogo:
            dados = self.catalogo[arquivo]
            colecoes_str = ", ".join(dados["colecoes"])
            self.lbl_info_foto.config(text=f"Aparece em: {colecoes_str}", foreground="#006633")
            
            self.entry_titulo.delete(0, tk.END)
            self.entry_titulo.insert(0, dados["titulo"])

            self.entry_link.delete(0, tk.END)
            self.entry_link.insert(0, dados["link_loja"])

            self.carregar_thumbnail(dados["caminho_local"])
        else:
            self.lbl_info_foto.config(text="Arquivo não encontrado nas coleções.", foreground="#aa0000")
            self.lbl_thumbnail.config(image="", text="Prévia da Foto")
            self.img_preview_ref = None

    def atualizar_html(self):
        arquivo = self.combo_arquivo.get().strip()
        novo_link = self.entry_link.get().strip()
        novo_titulo = self.entry_titulo.get().strip()

        if arquivo not in self.catalogo:
            messagebox.showwarning("Aviso", "Selecione um arquivo de foto válido na lista.")
            return

        if not novo_link:
            messagebox.showwarning("Aviso", "Cole o link da loja antes de atualizar.")
            return

        colecoes_alvo = self.catalogo[arquivo]["colecoes"]
        padrao_img = re.compile(r'<img\b[^>]*>', re.IGNORECASE | re.DOTALL)

        def substituir_tag(match):
            tag = match.group(0)
            if f"/{arquivo}" not in tag:
                return tag

            if re.search(r'\bdata-loja=["\'][^"\']*["\']', tag):
                tag = re.sub(r'\bdata-loja=["\'][^"\']*["\']', f'data-loja="{novo_link}"', tag)
            else:
                tag = re.sub(r'(\bsrc=["\'][^"\']+["\'])', rf'\1\n          data-loja="{novo_link}"', tag)

            if novo_titulo:
                if re.search(r'\bdata-titulo=["\'][^"\']*["\']', tag):
                    tag = re.sub(r'\bdata-titulo=["\'][^"\']*["\']', f'data-titulo="{novo_titulo}"', tag)
                else:
                    tag = re.sub(r'(\bdata-loja=["\'][^"\']+["\'])', rf'\1\n          data-titulo="{novo_titulo}"', tag)

            return tag

        for col in colecoes_alvo:
            caminho_html = os.path.join(PASTA_COLECOES, f"{col}.html")
            with open(caminho_html, "r", encoding="utf-8") as f:
                conteudo = f.read()

            novo_conteudo = padrao_img.sub(substituir_tag, conteudo)

            with open(caminho_html, "w", encoding="utf-8") as f:
                f.write(novo_conteudo)

        self.catalogo[arquivo]["link_loja"] = novo_link
        self.catalogo[arquivo]["titulo"] = novo_titulo

        texto_atual = self.txt_exportar.get("1.0", tk.END).strip()
        itens_atuais = [x.strip() for x in re.split(r'[,\s]+', texto_atual) if x.strip()]
        if arquivo not in itens_atuais:
            itens_atuais.append(arquivo)
            self.txt_exportar.delete("1.0", tk.END)
            self.txt_exportar.insert("1.0", ", ".join(itens_atuais))

        messagebox.showinfo("Sucesso", f"'{arquivo}' atualizado em:\n- " + "\n- ".join(colecoes_alvo))

    def puxar_todas_com_link(self):
        com_link = [nome for nome, dados in sorted(self.catalogo.items()) if dados["link_loja"]]

        if not com_link:
            messagebox.showinfo("Aviso", "Nenhuma foto com atributo 'data-loja' foi encontrada nos HTMLs.")
            return

        self.txt_exportar.delete("1.0", tk.END)
        self.txt_exportar.insert("1.0", ", ".join(com_link))
        messagebox.showinfo("Pronto", f"{len(com_link)} foto(s) com link carregada(s) na lista para exportação!")

    def exportar_csv(self):
        texto_bruto = self.txt_exportar.get("1.0", tk.END).strip()
        if not texto_bruto:
            messagebox.showwarning("Aviso", "Digite ou atualize ao menos um arquivo para exportar.")
            return

        filtros = [x.strip().lower() for x in re.split(r'[,\s]+', texto_bruto) if x.strip()]
        encontrados = []

        for nome_arq, dados in sorted(self.catalogo.items()):
            nome_sem_ext = os.path.splitext(nome_arq)[0].lower()
            if any(f == nome_sem_ext or f == nome_arq.lower() or f in nome_arq.lower() for f in filtros):
                encontrados.append((nome_arq, dados))

        if not encontrados:
            messagebox.showinfo("Nada encontrado", "Nenhuma foto correspondente foi encontrada no site.")
            return

        with open(ARQUIVO_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "Thumbnail",
                "Título",
                "Arquivo",
                "Coleções no Site",
                "No Site?",
                "data-loja no HTML?",
                "Link da Loja",
                "URL da Imagem"
            ])
            for nome_arq, dados in encontrados:
                writer.writerow([
                    "",  # Fica vazia; a ARRAYFORMULA no cabeçalho A1 preenche todas as miniaturas
                    dados["titulo"],
                    nome_arq,
                    ", ".join(dados["colecoes"]),
                    "TRUE",
                    "TRUE" if dados["link_loja"] else "FALSE",
                    dados["link_loja"],
                    dados["url_foto"]
                ])

        messagebox.showinfo(
            "CSV Gerado",
            f"{len(encontrados)} item(ns) exportado(s) para '{ARQUIVO_CSV}'.\n"
            "Agora basta importar no Google Sheets!"
        )


if __name__ == "__main__":
    root = tk.Tk()
    app = GerenciadorAcervoApp(root)
    root.mainloop()