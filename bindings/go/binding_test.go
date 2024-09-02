package tree_sitter_ql_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ql "github.com/tree-sitter/tree-sitter-ql/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ql.Language())
	if language == nil {
		t.Errorf("Error loading QL grammar")
	}
}
