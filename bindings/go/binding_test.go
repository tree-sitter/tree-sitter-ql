package tree_sitter_ql_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-ql"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ql.Language())
	if language == nil {
		t.Errorf("Error loading Ql grammar")
	}
}
